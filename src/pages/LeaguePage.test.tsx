import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { LeagueData } from "../types/league";
let LeaguePage: typeof import("./LeaguePage").default;
beforeEach(async () => { vi.resetModules(); LeaguePage = (await import("./LeaguePage")).default; });

const base = { date: "2099-11-21", time: null, venue: null, address: null, won: null, lost: null, pairs: [null, null, null], status: null, round: null, phase: null };
const data: LeagueData = {
  season: { startsOn: "2026-09", endsOn: "2027-09" }, standings: [],
  fixtures: [
    { ...base, id: "1", team: "Femenino", opponent: "Club de prueba Norte" },
    { ...base, id: "2", team: "Masculino", opponent: "Club de prueba Sur", date: "2020-11-21", won: 0, lost: 3 },
    { ...base, id: "3", team: "Femenino", opponent: "Club pendiente", date: "2020-11-22" },
  ],
};
function show() { return render(<MemoryRouter><LeaguePage language="es" /></MemoryRouter>); }
afterEach(() => vi.restoreAllMocks());

it("filters teams, distinguishes pending from zero, and reveals pending lineups", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(data));
  const user = userEvent.setup();
  show();
  expect(await screen.findByRole("heading", { name: /Club de prueba Norte/ })).toBeInTheDocument();
  expect(screen.getByLabelText("Block n’ Roll: 0; Club de prueba Sur: 3")).toBeInTheDocument();
  expect(screen.getByText("Resultado pendiente")).toBeInTheDocument();
  const fixture = screen.getByRole("heading", { name: /Club de prueba Norte/ }).closest("li")!;
  await user.click(within(fixture).getByText("Alineación de Block n’ Roll"));
  expect(fixture.querySelector("details")).toHaveAttribute("open");
  expect(within(fixture).getAllByText("Pendiente")).toHaveLength(3);
  await user.selectOptions(screen.getByRole("combobox", { name: "Equipo" }), "Femenino");
  expect(screen.queryByRole("heading", { name: /Club de prueba Sur/ })).not.toBeInTheDocument();
  expect(screen.getByText("La clasificación está pendiente de publicación.")).toBeInTheDocument();
});

it("shows a recoverable error and can retry", async () => {
  vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(Response.json(data));
  const user = userEvent.setup();
  show();
  await screen.findByRole("alert");
  await user.click(screen.getByRole("button", { name: "Volver a intentar" }));
  expect(await screen.findByRole("heading", { name: /Club de prueba Norte/ })).toBeInTheDocument();
});

it("distinguishes a missing publication from a request failure", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));
  show();
  expect(await screen.findByText("El calendario de la liga está pendiente de publicación.")).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
