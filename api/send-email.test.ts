import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render as renderEmail } from "@react-email/render";
import handler from "./send-email";

// Hoisted mocks so they are defined before module evaluation
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

type ApiRequest = { method?: string; body?: unknown };
type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (payload: unknown) => void;
  statusCode?: number;
  body?: unknown;
};

const createRes = () => {
  const res: ApiResponse & { statusCode: number; body: unknown } = {
    statusCode: 200,
    body: undefined as unknown as never,
    status(code: number) {
      this.statusCode = code;
      return this as unknown as ApiResponse;
    },
    json(payload: unknown) {
      this.body = payload as unknown as never;
    },
  };
  return res;
};

describe("api/send-email", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    sendMailMock.mockClear();
    createTransportMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 405 for non-POST", async () => {
    const res = createRes();
    await handler({ method: "GET" } as ApiRequest, res as ApiResponse);
    expect(res.statusCode).toBe(405);
    expect(res.body).toEqual({ ok: false, error: "Method Not Allowed" });
  });

  it("returns 500 when SMTP config is missing", async () => {
    const res = createRes();
    await handler({ method: "POST" } as ApiRequest, res as ApiResponse);
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ ok: false, error: "Missing SMTP configuration", code: "MISSING_SMTP_CONFIG" });
  });

  it("returns 400 when message or name is missing", async () => {
    vi.stubEnv("SMTP_HOST", "smtp.test");
    vi.stubEnv("SMTP_PORT", "587");
    vi.stubEnv("SMTP_USER", "user@test");
    vi.stubEnv("SMTP_PASS", "pass");
    vi.stubEnv("MAIL_TO", "to@test");

    const res = createRes();
    await handler({ method: "POST", body: { email: "a@b.com" } } as ApiRequest, res as ApiResponse);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ ok: false, error: "Missing message or name", code: "BAD_REQUEST" });
  });

  it("sends email for join inquiry", async () => {
    vi.stubEnv("SMTP_HOST", "smtp.test");
    vi.stubEnv("SMTP_PORT", "587");
    vi.stubEnv("SMTP_USER", "user@test");
    vi.stubEnv("SMTP_PASS", "pass");
    vi.stubEnv("MAIL_TO", "to@test");

    const res = createRes();
    const body = {
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello",
      meta: {
        inquiryType: "join",
        players: 3,
        level: "Intermedio",
        packageType: "two_per_week",
        availability: ["mon_18_1930", "wed_1930_21"],
      },
    };
    await handler({ method: "POST", body } as ApiRequest, res as ApiResponse);

    expect(res.statusCode).toBe(200);
    expect(sendMailMock).toHaveBeenCalled();
    const calls1 = sendMailMock.mock.calls as unknown as Array<[Record<string, unknown>]>;
    const args = (calls1[calls1.length - 1]?.[0]) as Record<string, unknown>;
    expect(String(args.subject)).toContain("BnR Web - Join - Jane Doe - jane@example.com");
    expect(args.to).toBe("to@test");
    expect(args.from).toBe("user@test");
  });

  it("sends email for info inquiry (talk)", async () => {
    vi.stubEnv("SMTP_HOST", "smtp.test");
    vi.stubEnv("SMTP_PORT", "587");
    vi.stubEnv("SMTP_USER", "user@test");
    vi.stubEnv("SMTP_PASS", "pass");
    vi.stubEnv("MAIL_TO", "to@test");

    const res = createRes();
    const body = {
      name: "John Smith",
      email: "john@example.com",
      message: "Hi",
      meta: {
        inquiryType: "talk",
      },
    };
    await handler({ method: "POST", body } as ApiRequest, res as ApiResponse);

    expect(res.statusCode).toBe(200);
    const calls2 = sendMailMock.mock.calls as unknown as Array<[Record<string, unknown>]>;
    const args2 = (calls2[calls2.length - 1]?.[0]) as Record<string, unknown>;
    expect(String(args2.subject)).toContain("BnR Web - Info - John Smith - john@example.com");
    expect(args2.to).toBe("to@test");
  });

  it("falls back to plain HTML when react-email render throws", async () => {
    vi.stubEnv("SMTP_HOST", "smtp.test");
    vi.stubEnv("SMTP_PORT", "587");
    vi.stubEnv("SMTP_USER", "user@test");
    vi.stubEnv("SMTP_PASS", "pass");
    vi.stubEnv("MAIL_TO", "to@test");

    type Fn = (...args: unknown[]) => unknown;
    type MockWithImplOnce = { mockImplementationOnce: (impl: Fn) => void };
    (renderEmail as unknown as MockWithImplOnce).mockImplementationOnce(() => {
      throw new Error("render fail");
    });

    const res = createRes();
    const body = { name: "Jane", email: "jane@x.com", message: "Hi", meta: { inquiryType: "join" } };
    await handler({ method: "POST", body } as ApiRequest, res as ApiResponse);

    expect(res.statusCode).toBe(200);
    expect(sendMailMock).toHaveBeenCalled();
    const calls = sendMailMock.mock.calls as unknown as Array<[Record<string, unknown>]>;
    const html = String(calls[calls.length - 1]?.[0]?.html ?? "");
    expect(html).toContain("New contact message");
    expect(html).toContain("Jane");
  });

  it("returns 500 when sendMail throws", async () => {
    vi.stubEnv("SMTP_HOST", "smtp.test");
    vi.stubEnv("SMTP_PORT", "587");
    vi.stubEnv("SMTP_USER", "user@test");
    vi.stubEnv("SMTP_PASS", "pass");
    vi.stubEnv("MAIL_TO", "to@test");

    sendMailMock.mockImplementationOnce(async () => {
      throw new Error("smtp down");
    });

    const res = createRes();
    const body = { name: "Err", email: "e@x.com", message: "Hi" };
    await handler({ method: "POST", body } as ApiRequest, res as ApiResponse);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ ok: false, error: "Email send failed", code: "SEND_FAILED" });
  });
});


