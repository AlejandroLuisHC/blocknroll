import React from "react";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import ContactEmail from "../emails/ContactEmail";

type InquiryType = "join" | "talk";

interface IncomingMeta {
  inquiryType?: InquiryType;
  fullName?: string;
  email?: string;
  phone?: string;
  players?: number;
  level?: string;
  packageType?: string;
  availability?: string[];
  [key: string]: unknown;
}

interface IncomingBody {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  meta?: IncomingMeta;
}

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (payload: unknown) => void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
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

    const { name, email, phone, message, meta } = (req.body || {}) as IncomingBody;

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

    const inquiryType: InquiryType = (meta?.inquiryType === "talk" ? "talk" : "join");
    const subject = `BnR Web - ${inquiryType === "join" ? "Join" : "Info"} - ${name || "Web user"} - ${email || ""}`;

    const summaryRows: Array<[string, string]> = [
      ["Type", inquiryType === "join" ? "Join" : "Info"],
      ["Name", name || "-"],
      ["Email", email || "-"],
      ["Phone", phone || ""],
    ];

    const detailsRows: Array<[string, string]> = [];
    if (inquiryType === "join") {
      if (meta?.players != null) detailsRows.push(["Players", String(meta.players)]);
      if (meta?.level) detailsRows.push(["Level", String(meta.level)]);
      if (meta?.packageType) detailsRows.push(["Package", String(meta.packageType)]);
      if (Array.isArray(meta?.availability)) {
        detailsRows.push(["Availability", meta.availability.length ? meta.availability.join(", ") : "No preference"]);
      }
    }

    let html: string;
    try {
      html = await render(
        React.createElement(ContactEmail, {
          title: "New contact message",
          summary: summaryRows,
          details: detailsRows.length ? detailsRows : undefined,
          message,
        })
      );
    } catch (renderError) {
      console.error("render error:", renderError);
      // Fallback very simple HTML
      const esc = (s: string) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const line = (k: string, v?: string) => (v ? `<p><strong>${esc(k)}:</strong> ${esc(v)}</p>` : "");
      const details = detailsRows
        .map(([k, v]) => line(k, v))
        .join("");
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
      replyTo: email || undefined,
      subject,
      html,
    });

    res.status(200).json({ ok: true, id: info.messageId });
  } catch (error) {
    console.error("send-email error:", error);
    res.status(500).json({ ok: false, error: "Email send failed", code: "SEND_FAILED" });
  }
}


