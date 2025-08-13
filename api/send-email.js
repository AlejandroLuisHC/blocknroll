import nodemailer from "nodemailer";

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
      res.status(500).json({ ok: false, error: "Missing SMTP configuration" });
      return;
    }

    const { name, email, message } = req.body || {};

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

    const subject = `Contact form: ${name || "User"}`;
    const html = `
      <h2>New contact message</h2>
      <p><strong>Name:</strong> ${name || "-"}</p>
      ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
      <hr />
      <p>${String(message).replace(/\n/g, "<br/>")}</p>
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
    res.status(500).json({ ok: false, error: "Email send failed" });
  }
}



