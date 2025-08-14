import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import handler from "./send-email";

const { sendMailMock, createTransportMock } = vi.hoisted(() => {
  const sendMailMock = vi.fn(async () => ({ messageId: "test-id" }));
  const createTransportMock = vi.fn(() => ({ sendMail: sendMailMock }));
  return { sendMailMock, createTransportMock };
});

vi.mock("nodemailer", () => ({
  default: { createTransport: createTransportMock },
}));

vi.mock("@react-email/render", () => ({
  render: vi.fn(() => "<html><body>email</body></html>"),
}));

const createRes = () => {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
    },
  };
  return res;
};

describe("api/send-email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 405 for non-POST methods", async () => {
    const res = createRes();
    await handler({ method: "GET" }, res);
    expect(res.statusCode).toBe(405);
    expect(res.body).toEqual({ ok: false, error: "Method Not Allowed" });
  });

  it("returns 500 when SMTP config is missing", async () => {
    const res = createRes();
    await handler({ method: "POST" }, res);
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ ok: false, error: "Missing SMTP configuration", code: "MISSING_SMTP_CONFIG" });
  });

  it("returns 400 when message is missing", async () => {
    vi.stubEnv("SMTP_HOST", "smtp.test");
    vi.stubEnv("SMTP_PORT", "587");
    vi.stubEnv("SMTP_USER", "user@test");
    vi.stubEnv("SMTP_PASS", "pass");
    vi.stubEnv("MAIL_TO", "to@test");

    const res = createRes();
    await handler({ method: "POST", body: {} }, res);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ ok: false, error: "Missing message or name", code: "BAD_REQUEST" });
  });

  it("sends email for join inquiry with correct subject", async () => {
    vi.stubEnv("SMTP_HOST", "smtp.test");
    vi.stubEnv("SMTP_PORT", "587");
    vi.stubEnv("SMTP_USER", "user@test");
    vi.stubEnv("SMTP_PASS", "pass");
    vi.stubEnv("MAIL_TO", "to@test");

    const res = createRes();
    await handler(
      {
        method: "POST",
        body: {
          name: "Alice",
          email: "alice@example.com",
          phone: "+34 600 000 000",
          message: "Standardized message",
          meta: {
            inquiryType: "join",
            players: 3,
            level: "Intermedio",
            packageType: "two_per_week",
            availability: ["mon_18_1930"],
          },
        },
      },
      res
    );

    expect(createTransportMock).toHaveBeenCalled();
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "BnR Web - Join - Alice - alice@example.com",
      })
    );
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true, id: "test-id" });
  });

  it("sends email for info inquiry with correct subject", async () => {
    vi.stubEnv("SMTP_HOST", "smtp.test");
    vi.stubEnv("SMTP_PORT", "587");
    vi.stubEnv("SMTP_USER", "user@test");
    vi.stubEnv("SMTP_PASS", "pass");
    vi.stubEnv("MAIL_TO", "to@test");

    const res = createRes();
    await handler(
      {
        method: "POST",
        body: {
          name: "Bob",
          email: "bob@example.com",
          message: "Standardized message",
          meta: { inquiryType: "talk" },
        },
      },
      res
    );

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "BnR Web - Info - Bob - bob@example.com",
      })
    );
    expect(res.statusCode).toBe(200);
  });
});


