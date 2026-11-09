import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { CLUB_EMAIL, DIRECTIONS_URL } from "../constants/club";
import i18n from "../i18n";
import HomePage from "../pages/HomePage";

vi.mock("../hooks/useClubSeason", () => ({ useClubSeason: () => undefined }));

beforeEach(async () => {
  await i18n.changeLanguage("es");
  vi.stubEnv("VITE_CONTACT_ENDPOINT", "/api/send-email");
});

afterEach(() => vi.unstubAllEnvs());

const response = (ok: boolean) => ({ ok }) as Response;

it("keeps the draft and selected availability when choosing private training", async () => {
  const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(response(true));
  const user = userEvent.setup();
  render(<HomePage />);

  await user.type(screen.getByLabelText(/nombre completo/i), "Ada Example");
  await user.type(screen.getByLabelText(/correo electrónico/i, { selector: "input" }), "ada@example.com");
  await user.type(screen.getByLabelText(/teléfono/i), "+34 600 000 000");
  await user.selectOptions(screen.getByLabelText("Número de jugadores"), "3");
  await user.selectOptions(screen.getByLabelText("Nivel aproximado"), "Intermedio");
  const monday = screen.getByRole("checkbox", { name: "Lunes 18:00–19:30" });
  expect(screen.queryByRole("checkbox", { name: /viernes/i })).not.toBeInTheDocument();
  await user.click(monday);
  await user.click(screen.getByRole("link", { name: /consultar plaza: dos entrenos/i }));
  expect(screen.getByLabelText("Modalidad")).toHaveValue("two_per_week");
  expect(monday).toBeChecked();

  await user.click(screen.getByRole("link", { name: /consultar plaza: entrenamiento privado/i }));
  expect(screen.getByLabelText("Modalidad")).toHaveValue("private");
  expect(screen.getByLabelText(/nombre completo/i)).toHaveValue("Ada Example");
  expect(monday).toBeChecked();

  await user.click(screen.getByRole("button", { name: "Enviar solicitud" }));
  expect(await screen.findByText(/solicitud enviada/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Enviar solicitud" })).toBeEnabled();
  expect(fetchMock).toHaveBeenCalledWith("/api/send-email", expect.objectContaining({ method: "POST" }));
  const payload = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
  expect(payload.meta).toMatchObject({
    inquiryType: "join", packageType: "private", fullName: "Ada Example",
    phone: "+34 600 000 000", players: 3, level: "Intermedio", availability: ["mon_18_1930"],
  });
});

it("validates fields and retains the question and availability when retrying an enquiry", async () => {
  const fetchMock = vi.spyOn(globalThis, "fetch")
    .mockResolvedValueOnce(response(false))
    .mockResolvedValueOnce(response(true));
  const user = userEvent.setup();
  render(<HomePage />);

  expect(screen.getByRole("link", { name: "Cómo llegar" })).toHaveAttribute("href", DIRECTIONS_URL);
  expect(screen.getByRole("link", { name: CLUB_EMAIL })).toHaveAttribute("href", "mailto:" + CLUB_EMAIL);

  await user.click(screen.getByRole("radio", { name: "Quiero información" }));
  expect(screen.queryByLabelText("Modalidad")).not.toBeInTheDocument();
  const thursday = screen.getByRole("checkbox", { name: "Jueves 19:30–21:00" });
  const submit = screen.getByRole("button", { name: "Enviar solicitud" });
  const name = screen.getByLabelText(/nombre completo/i);
  const email = screen.getByLabelText(/correo electrónico/i, { selector: "input" });

  await user.click(submit);
  expect(name).toHaveFocus();
  expect(name).toHaveAccessibleDescription(/al menos dos caracteres/i);
  expect(email).toHaveAccessibleDescription(/correo válida/i);
  expect(fetchMock).not.toHaveBeenCalled();

  await user.type(name, "Ada Example");
  await user.type(email, "ada@example.com");
  const question = screen.getByLabelText(/qué te gustaría saber/i);
  await user.type(question, "¿Hay plazas para iniciación?");
  await user.click(thursday);
  await user.click(submit);
  expect(await screen.findByRole("alert")).toHaveTextContent(/vuelve a intentarlo/i);
  expect(question).toHaveValue("¿Hay plazas para iniciación?");
  expect(thursday).toBeChecked();

  await user.click(submit);
  expect(await screen.findByText(/consulta enviada/i)).toBeInTheDocument();
  expect(screen.getByRole("radio", { name: "Quiero información" })).toBeChecked();
  const payload = JSON.parse(String(fetchMock.mock.calls[1][1]?.body));
  expect(payload.meta).toEqual({
    inquiryType: "talk", fullName: "Ada Example", email: "ada@example.com", phone: "",
    availability: ["thu_1930_21"],
  });
  expect(payload.message).toContain("¿Hay plazas para iniciación?");
  expect(payload.message).toContain("Disponibilidad horaria: thu_1930_21");
});

it("carries the trial request through the normal enquiry endpoint", async () => {
  const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(response(true));
  const user = userEvent.setup();
  render(<HomePage />);

  await user.click(screen.getAllByRole("link", { name: "Pedir una clase de prueba" })[0]);
  expect(screen.getByText("Solicitud de clase de prueba")).toBeInTheDocument();
  await user.selectOptions(screen.getByLabelText("Modalidad"), "two_per_week");
  await user.type(screen.getByLabelText(/nombre completo/i), "Ada Example");
  await user.type(screen.getByLabelText(/correo electrónico/i, { selector: "input" }), "ada@example.com");
  await user.click(screen.getByRole("button", { name: "Enviar solicitud" }));
  expect(await screen.findByText(/solicitud enviada/i)).toBeInTheDocument();

  const payload = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
  expect(payload.message).toContain("Interés: clase de prueba");
  expect(payload.meta).toMatchObject({ packageType: "two_per_week", availability: [] });
  expect(payload.meta).not.toHaveProperty("trialRequested");
});

it("prevents duplicate requests while the endpoint is responding", async () => {
  let resolveRequest: (result: Response) => void = () => {};
  const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(
    () => new Promise((resolve) => { resolveRequest = resolve; }),
  );
  render(<HomePage />);
  fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: "Ada Example" } });
  fireEvent.change(screen.getByLabelText(/correo electrónico/i, { selector: "input" }),
    { target: { value: "ada@example.com" } });
  const form = screen.getByRole("form", { name: "Escríbenos" });

  fireEvent.submit(form);
  expect(screen.getByRole("button", { name: "Enviando…" })).toBeDisabled();
  fireEvent.submit(form);
  expect(fetchMock).toHaveBeenCalledOnce();
  resolveRequest(response(true));
  expect(await screen.findByText(/solicitud enviada/i)).toBeInTheDocument();
});
