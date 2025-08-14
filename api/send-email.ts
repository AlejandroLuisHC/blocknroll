import nodemailer from "nodemailer";

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
      res.status(500).json({
        ok: false,
        error: "Missing SMTP configuration",
        code: "MISSING_SMTP_CONFIG",
      });
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

    const escape = (s: string) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const simpleLine = (k: string, v?: string) => (v ? `<p><strong>${escape(k)}:</strong> ${escape(v)}</p>` : "");
    const html = `
      <h2>New contact message</h2>
      ${simpleLine("Type", inquiryType === "join" ? "Join" : "Info")}
      ${simpleLine("Name", name)}
      ${simpleLine("Email", email)}
      ${simpleLine("Phone", phone)}
      ${inquiryType === "join" ? `
        ${simpleLine("Players", meta?.players != null ? String(meta.players) : undefined)}
        ${simpleLine("Level", meta?.level ? String(meta.level) : undefined)}
        ${simpleLine("Package", meta?.packageType ? String(meta.packageType) : undefined)}
        ${simpleLine("Availability", Array.isArray(meta?.availability) ? (meta!.availability!.length ? meta!.availability!.join(", ") : "No preference") : undefined)}
      ` : ""}
      <hr />
      <pre style="white-space:pre-wrap;font-family:inherit;">${escape(message)}</pre>
    `;

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


