import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import handler from "./send-email.js";
import { render } from "@react-email/render";

// Hoisted placeholders so they can be referenced inside vi.mock factories
const { sendMailMock, createTransportMock } = vi.hoisted(() => ({
	sendMailMock: vi.fn(),
	createTransportMock: vi.fn(),
}));

vi.mock("nodemailer", () => ({
	default: {
		createTransport: (...args) => {
			createTransportMock(...args);
			return { sendMail: sendMailMock };
		},
	},
}));

vi.mock("@react-email/render", () => ({
	render: vi.fn(async () => "<html>ok</html>"),
}));

const createRes = () => {
	const res = {
		setHeader: vi.fn(),
		status: vi.fn().mockReturnThis(),
		json: vi.fn(),
	};
	return res;
};

const validBody = { name: "Ana Soler", email: "ana+club@example.com", message: "Hola, ¿hay plazas?" };
const post = (body = validBody, headers = {}) => ({
  method: "POST",
  body,
  headers: { "content-type": "application/json; charset=UTF-8", ...headers },
});

describe("api/send-email", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		sendMailMock.mockResolvedValue({ messageId: "test-message-id" });
		vi.stubEnv("SMTP_HOST", "smtp.example.com");
		vi.stubEnv("SMTP_PORT", "587");
		vi.stubEnv("SMTP_USER", "user@example.com");
		vi.stubEnv("SMTP_PASS", "password");
		vi.stubEnv("MAIL_TO", "dest@example.com");
		vi.stubEnv("VERCEL_ENV", "production");
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("returns 405 for non-POST methods", async () => {
		const req = { method: "GET" };
		const res = createRes();
		await handler(req, res);
		expect(res.status).toHaveBeenCalledWith(405);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
	});

	it("returns 500 when SMTP config is missing", async () => {
		vi.stubEnv("SMTP_HOST", undefined);
		const req = post();
		const res = createRes();
		await handler(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ code: "MISSING_SMTP_CONFIG" })
		);
	});

	it("returns 400 when required fields are missing", async () => {
		const req = post({ name: "", message: "" });
		const res = createRes();
		await handler(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
	});

  it.each([
    { email: "" },
    { email: "Ana Soler <ana@example.com>" },
    { email: "ana@example.com, otra@example.com" },
    { name: "Ana\nSoler" },
    { name: "x".repeat(121) },
    { phone: { number: "123" } },
    { message: "x".repeat(4001) },
    { meta: { players: 9 } },
    { meta: { packageType: "otro" } },
    { meta: { availability: ["invalid_slot"] } },
    { meta: { availability: Array(16).fill("mon_18_1930") } },
  ])("rejects invalid fields before constructing an email", async (fields) => {
    const res = createRes();
    await handler(post({ ...validBody, ...fields }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(render).not.toHaveBeenCalled();
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it("rejects non-JSON requests and oversized JSON before constructing an email", async () => {
    const unsupported = createRes();
    await handler(post(validBody, { "content-type": "text/plain" }), unsupported);
    expect(unsupported.status).toHaveBeenCalledWith(415);

    const withLength = createRes();
    const request = post(validBody, { "content-length": "16385" });
    const readBody = vi.fn(() => validBody);
    Object.defineProperty(request, "body", { get: readBody });
    await handler(request, withLength);
    expect(withLength.status).toHaveBeenCalledWith(413);
    expect(readBody).not.toHaveBeenCalled();

    const withoutLength = createRes();
    await handler(post({ ...validBody, extra: "é".repeat(9000) }), withoutLength);
    expect(withoutLength.status).toHaveBeenCalledWith(413);
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it.each(["preview", "development"])("disables real SMTP in Vercel %s even if credentials are configured", async (environment) => {
    vi.stubEnv("VERCEL_ENV", environment);
    const res = createRes();
    await handler(post(), res);
    expect(res.status).toHaveBeenCalledWith(503);
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it.each([["587", false], ["465", true]])("uses TLS and bounded timeouts for SMTP port %s", async (port, secure) => {
    vi.stubEnv("SMTP_PORT", port);
    const res = createRes();
    await handler(post(), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(createTransportMock).toHaveBeenCalledWith(expect.objectContaining({
      port: Number(port), secure, requireTLS: !secure, dnsTimeout: 3000,
      connectionTimeout: 5000, greetingTimeout: 5000, socketTimeout: 8000,
    }));
    expect(sendMailMock).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
      to: "dest@example.com", replyTo: { address: validBody.email, name: "" },
    }));
  });

  it("returns a delivery error without retrying or logging the SMTP message", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    sendMailMock.mockRejectedValueOnce(Object.assign(new Error("Private SMTP response"), { code: "ETIMEDOUT" }));
    const res = createRes();
    await handler(post(), res);
    expect(res.status).toHaveBeenCalledWith(502);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith("send-email: SMTP delivery failed", { code: "ETIMEDOUT", responseCode: undefined });
    log.mockRestore();
  });

  it.each([
    { inquiryType: "join", packageType: "one_per_week" },
    { inquiryType: "join", packageType: "private" },
    { inquiryType: "talk" },
  ])("formats availability in the email for %j", async (enquiry) => {
    const req = post({
				name: "Jane",
				email: "jane@example.com",
				message: "Hello world",
				meta: {
					...enquiry,
          availability: ["mon_18_1930", "wed_1930_21", "thu_21_2230"],
				},
		});
		const res = createRes();
		await handler(req, res);

		// Response
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ ok: true, id: "test-message-id" });
		expect(sendMailMock).toHaveBeenCalled();

		// Render call and props
		const element = render.mock.calls[0][0];
		expect(element).toBeTruthy();
		const props = element.props || {};
		expect(Array.isArray(props.details)).toBe(true);
    const availabilityRow = props.details.find((row) => row[0] === "Disponibilidad");
		expect(availabilityRow).toBeTruthy();
		expect(Array.isArray(availabilityRow[1])).toBe(true);
    expect(availabilityRow[1]).toEqual(["Lun 18:00-19:30", "Mié 19:30-21:00", "Jue 21:00-22:30"]);
	});

	it("falls back to simple HTML when render throws", async () => {
		render.mockImplementationOnce(async () => {
			throw new Error("render boom");
		});

		const req = post();
		const res = createRes();
		await handler(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(sendMailMock).toHaveBeenCalled();
	});
});
