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

it("shows an empty published season without inventing fixtures or standings", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ fixtures: [], standings: [], season: { startsOn: null, endsOn: null } }));
  show();
  expect(await screen.findByText("No hay próximos encuentros publicados para esta selección.")).toBeInTheDocument();
  expect(screen.getByText("Todavía no hay encuentros disputados para esta selección.")).toBeInTheDocument();
  expect(screen.getByText("La clasificación está pendiente de publicación.")).toBeInTheDocument();
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  expect(screen.queryByText(/Temporada/)).not.toBeInTheDocument();
});

it("keeps postponed fixtures in the agenda and displays partial scores, directions and lineups", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ ...data, fixtures: [
    { ...base, id: "postponed", team: "Equipo ficticio", opponent: "Club aplazado", date: "2020-11-21", status: "postponed", won: null, lost: 2,
      time: "10:30", venue: "Pista ficticia", address: "Dirección ficticia", phase: "Fase de prueba", round: "2", pairs: ["Pareja ficticia", null, null] },
    { ...base, id: "partial", team: "Equipo ficticio", opponent: "Club parcial", won: 1, lost: null, round: "3" },
    { ...base, id: "cancelled", team: "Equipo ficticio", opponent: "Club cancelado", date: "2020-11-20", status: "cancelled", won: 0, lost: 3 },
  ] }));
  show();
  const heading = await screen.findByRole("heading", { name: /Club aplazado/ });
  const fixture = heading.closest("li")!;
  const agenda = screen.getByRole("region", { name: "Próximos encuentros" });
  expect(within(agenda).getByText("Aplazado")).toBeInTheDocument();
  expect(within(fixture).getByText("Fase de prueba · Jornada 2")).toBeInTheDocument();
  expect(within(fixture).getByText("10:30")).toBeInTheDocument();
  expect(within(fixture).getByLabelText("Block n’ Roll: Pendiente; Club aplazado: 2")).toBeInTheDocument();
  expect(screen.getByLabelText("Block n’ Roll: 1; Club parcial: Pendiente")).toBeInTheDocument();
  expect(within(fixture).getByRole("link", { name: "Cómo llegar" })).toHaveAttribute("href", "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Pista ficticia · Dirección ficticia"));
  expect(within(fixture).getByText("Pareja ficticia")).toBeInTheDocument();
  const cancelled = screen.getByRole("heading", { name: /Club cancelado/ }).closest("li")!;
  expect(within(cancelled).getByText("Cancelado")).toBeInTheDocument();
  expect(within(cancelled).queryByLabelText(/Block n’ Roll:/)).not.toBeInTheDocument();
});

it("groups published standings and orders positions while distinguishing zero from pending statistics", async () => {
  const standing = { competition: "Competición de prueba", category: "Femenina", group: "Grupo de prueba", played: null, won: null, lost: null };
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ ...data, standings: [
    { ...standing, team: "Club segundo", position: 2, points: null },
    { ...standing, team: "Club primero", position: 1, points: 0 },
    { ...standing, team: "Club sin grupo", position: 1, points: null, competition: null, category: null, group: null },
  ] }));
  show();
  const table = await screen.findByRole("table", { name: "Competición de prueba · Femenina · Grupo de prueba" });
  const rows = within(table).getAllByRole("row");
  expect(within(rows[1]).getByRole("rowheader")).toHaveTextContent("Club primero");
  expect(within(rows[1]).getByRole("cell", { name: "0" })).toBeInTheDocument();
  expect(within(rows[2]).getByRole("rowheader")).toHaveTextContent("Club segundo");
  expect(within(rows[2]).getAllByRole("cell", { name: "—" })).toHaveLength(4);
  expect(screen.getByRole("table", { name: "Clasificación" })).toHaveTextContent("Club sin grupo");
});
