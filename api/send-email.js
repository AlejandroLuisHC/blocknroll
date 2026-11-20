import React from "react";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import ContactEmail from "../emails/ContactEmail.js";
import limits from "../lib/contact-limits.json" with { type: "json" };

const DAYS = { mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie" };
const SLOTS = { "18_1930": "18:00-19:30", "1930_21": "19:30-21:00", "21_2230": "21:00-22:30" };
const AVAILABILITY = new Map(Object.entries(DAYS).flatMap(([key, day]) =>
  Object.entries(SLOTS).map(([slot, time]) => [`${key}_${slot}`, `${day} ${time}`])
));
const PACKAGES = new Map([
  ["one_per_week", "Una vez por semana"],
  ["two_per_week", "Dos veces por semana"],
  ["private", "Privados"],
]);
const LEVELS = new Set(["", "Iniciación", "Básico", "Intermedio", "Avanzado"]);
const MAILBOX = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;
const CONTROL_CHARACTER = /\p{Cc}/u;

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseContact(body) {
  const { name, email, phone = "", message, meta = {} } = body;
  if (
    typeof name !== "string" || name.length > limits.name || name.trim().length < 2 || CONTROL_CHARACTER.test(name) ||
    typeof email !== "string" || email.length > limits.email || CONTROL_CHARACTER.test(email) || !MAILBOX.test(email.trim()) ||
    typeof phone !== "string" || phone.length > limits.phone || CONTROL_CHARACTER.test(phone) ||
    typeof message !== "string" || message.length > limits.message || !message.trim() ||
    !isRecord(meta)
  ) return null;

  const { inquiryType = "join", players, level, packageType, availability } = meta;
  if (
    (inquiryType !== "join" && inquiryType !== "talk") ||
    (players !== undefined && (!Number.isInteger(players) || players < 1 || players > 8)) ||
    (level !== undefined && !LEVELS.has(level)) ||
    (packageType !== undefined && !PACKAGES.has(packageType)) ||
    (availability !== undefined && (!Array.isArray(availability) || availability.length > AVAILABILITY.size ||
      !availability.every((slot) => AVAILABILITY.has(slot))))
  ) return null;

  return { name: name.trim(), email: email.trim(), phone: phone.trim(), message, inquiryType, players, level, packageType, availability };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  const environment = process.env.VERCEL_ENV;
  if (environment && environment !== "production") {
    return res.status(503).json({ ok: false, code: "EMAIL_DISABLED" });
  }

  const contentType = req.headers?.["content-type"]?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return res.status(415).json({ ok: false, code: "UNSUPPORTED_MEDIA_TYPE" });
  }
  if (Number(req.headers?.["content-length"]) > limits.requestBytes) {
    return res.status(413).json({ ok: false, code: "REQUEST_TOO_LARGE" });
  }

  let body;
  try {
    body = req.body;
    if (!isRecord(body)) return res.status(400).json({ ok: false, code: "BAD_REQUEST" });
    if (Buffer.byteLength(JSON.stringify(body)) > limits.requestBytes) {
      return res.status(413).json({ ok: false, code: "REQUEST_TOO_LARGE" });
    }
  } catch {
    return res.status(400).json({ ok: false, code: "BAD_REQUEST" });
  }

  const contact = parseContact(body);
  if (!contact) return res.status(400).json({ ok: false, code: "BAD_REQUEST" });
  const { name, email, phone, message, inquiryType, players, level, packageType, availability } = contact;

  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const mailTo = process.env.MAIL_TO;

    if (!smtpHost || !smtpUser || !smtpPass || !mailTo || !Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) {
      console.error("send-email: invalid SMTP configuration");
      res.status(500).json({ ok: false, code: "MISSING_SMTP_CONFIG" });
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      requireTLS: smtpPort !== 465,
      dnsTimeout: 3000,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const subject = `BnR Web - ${inquiryType === "join" ? "Join" : "Info"} - ${name} - ${email}`;

    const summaryRows = [
      ["Tipo de consulta", inquiryType === "join" ? "Apuntarse a entrenamientos" : "Información"],
      ["Nombre", name],
      ["Email", email],
    ];
    if (phone) summaryRows.push(["Teléfono", phone]);

    const detailsRows = [];
    if (inquiryType === "join") {
      if (players !== undefined) detailsRows.push(["Número de jugadores", String(players)]);
      if (level) detailsRows.push(["Nivel estimado", level]);
      if (packageType) detailsRows.push(["Paquete", PACKAGES.get(packageType)]);
    }
    if (availability) {
      detailsRows.push(["Disponibilidad", availability.length ? availability.map((slot) => AVAILABILITY.get(slot)) : ["Sin preferencia"]]);
    }

    let html;
    try {
      html = await render(
        React.createElement(ContactEmail, {
          title: "New contact message",
          summary: summaryRows,
          details: detailsRows.length ? detailsRows : undefined,
          message,
        })
      );
    } catch {
      console.error("send-email: email template rendering failed");
      const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const line = (k, v) => (v ? `<p><strong>${esc(k)}:</strong> ${esc(v)}</p>` : "");
      const details = detailsRows.map(([k, v]) => line(k, v)).join("");
      html = `
        <h2>New contact message</h2>
        ${summaryRows.map(([k, v]) => line(k, v)).join("")}
        ${details}
        <hr />
        <div>${esc(message)}</div>
      `;
    }

    const info = await transporter.sendMail({
      from: smtpUser,
      to: mailTo,
      replyTo: { address: email, name: "" },
      subject,
      html,
    });

    res.status(200).json({ ok: true, id: info.messageId });
  } catch (error) {
    console.error("send-email: SMTP delivery failed", { code: error?.code, responseCode: error?.responseCode });
    res.status(502).json({ ok: false, code: "SEND_FAILED" });
  }
}


