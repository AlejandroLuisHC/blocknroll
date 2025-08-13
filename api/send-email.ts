import React from "react";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import ContactEmail, { type ContactEmailProps } from "../emails/ContactEmail";

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
      res.status(500).json({ ok: false, error: "Missing SMTP configuration" });
      return;
    }

    const { name, email, phone, message, meta } = (req.body || {}) as IncomingBody;

    if (!message) {
      res.status(400).json({ ok: false, error: "Missing message" });
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
    ];
    if (phone) summaryRows.push(["Phone", phone]);

    const detailsRows: Array<[string, string]> = [];
    if (inquiryType === "join") {
      if (meta?.players != null) detailsRows.push(["Players", String(meta.players)]);
      if (meta?.level) detailsRows.push(["Level", String(meta.level)]);
      if (meta?.packageType) detailsRows.push(["Package", String(meta.packageType)]);
      if (Array.isArray(meta?.availability)) {
        detailsRows.push(["Availability", meta.availability.length ? meta.availability.join(", ") : "No preference"]);
      }
    }

    const emailProps: ContactEmailProps = {
      title: "New contact message",
      summary: summaryRows,
      details: detailsRows.length ? detailsRows : undefined,
      message,
    };
    const html = render(React.createElement(ContactEmail, emailProps));

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


