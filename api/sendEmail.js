import React from "react";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import ContactEmail from "../emails/ContactEmail";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const mailTo = process.env.MAIL_TO;

    if (!smtpHost || !smtpUser || !smtpPass || !mailTo) {
      res.status(500).json({ ok: false, error: "Missing SMTP configuration", code: "MISSING_SMTP_CONFIG" });
      return;
    }

    const { name, email, phone, message, meta } = req.body || {};

    if (!message || !name) {
      res.status(400).json({ ok: false, error: "Missing message or name", code: "BAD_REQUEST" });
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const inquiryType = meta?.inquiryType === "talk" ? "Info" : "Join";
    const subject = `BnR Web - ${inquiryType} - ${name || "Web user"} - ${email || ""}`;

    const summaryRows = [
      ["Type", inquiryType],
      ["Name", name || "-"],
      ["Email", email || "-"],
      ["Phone", phone || ""],
    ];

    const detailsRows = meta && inquiryType === "Join"
      ? [
          ["Players", meta.players != null ? String(meta.players) : ""],
          ["Level", meta.level ? String(meta.level) : ""],
          ["Package", meta.packageType ? String(meta.packageType) : ""],
          [
            "Availability",
            Array.isArray(meta.availability)
              ? (meta.availability.length ? meta.availability.join(", ") : "No preference")
              : "",
          ],
        ]
      : [];

    const html = render(
      React.createElement(ContactEmail, {
        title: "New contact message",
        summary: summaryRows,
        details: detailsRows.length ? detailsRows : undefined,
        message,
      })
    );

    const info = await transporter.sendMail({
      from: smtpUser,
      to: mailTo,
      replyTo: email || undefined,
      subject,
      html,
    });

    res.status(200).json({ ok: true, id: info.messageId });
  } catch (error) {
    console.error("send-email error:", error);
    res.status(500).json({ ok: false, error: "Email send failed" });
  }
}


