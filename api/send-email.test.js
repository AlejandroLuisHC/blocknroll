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
		status: vi.fn().mockReturnThis(),
		json: vi.fn(),
	};
	return res;
};

describe("api/send-email", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubEnv("SMTP_HOST", "smtp.example.com");
		vi.stubEnv("SMTP_PORT", "587");
		vi.stubEnv("SMTP_USER", "user@example.com");
		vi.stubEnv("SMTP_PASS", "password");
		vi.stubEnv("MAIL_TO", "dest@example.com");
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
		vi.unstubAllEnvs(); // simulate missing env
		const req = { method: "POST", body: { name: "John", message: "Hi" } };
		const res = createRes();
		await handler(req, res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ code: "MISSING_SMTP_CONFIG" })
		);
	});

	it("returns 400 when required fields are missing", async () => {
		const req = { method: "POST", body: { name: "", message: "" } };
		const res = createRes();
		await handler(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
	});

  it("sends email and formats availability labels to Spanish day/time", async () => {
		const req = {
			method: "POST",
			body: {
				name: "Jane",
				email: "jane@example.com",
				message: "Hello world",
				meta: {
					inquiryType: "join",
          availability: ["mon_18_1930", "wed_1930_21", "thu_21_2230"],
				},
			},
		};
		const res = createRes();
		await handler(req, res);

		// Response
		expect(res.status).toHaveBeenCalledWith(200);
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

		const req = { method: "POST", body: { name: "John", email: "john@example.com", message: "Hi" } };
		const res = createRes();
		await handler(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(sendMailMock).toHaveBeenCalled();
	});
});
