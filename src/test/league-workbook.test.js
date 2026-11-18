import { expect, it } from "vitest";
import { parseLeagueWorkbook } from "../../lib/league-workbook.js";
import { createLeagueWorkbookBuffer as variant } from "./helpers/league-workbook.js";

it("reads the supported format with fictitious Excel dates and times, preserving missing results and lineups", async () => {
  const data = await parseLeagueWorkbook(await variant());
  expect(data.fixtures).toHaveLength(2);
  expect(data.fixtures[0]).toMatchObject({ date: "2030-11-02", time: "10:00", opponent: "Club de prueba Norte", won: null, lost: null, pairs: [null, null, null] });
  expect(data.fixtures[1]).toMatchObject({ date: "2030-11-03", time: "10:00", venue: "Pista de prueba Sur" });
  expect(data.standings).toEqual([]);
}, 15000);

it("preserves a genuine zero and partial scores, and reads amended pair names with trailing-space headers", async () => {
  const data = await parseLeagueWorkbook(await variant((sheet) => {
    sheet.getCell("F2").value = 0;
    sheet.getCell("G2").value = 3;
    sheet.getCell("F3").value = 1;
    sheet.getCell("I2").value = "Jugador A; Jugador B";
  }));
  expect(data.fixtures[0]).toMatchObject({ won: 0, lost: 3, pairs: [null, "Jugador A; Jugador B", null] });
  expect(data.fixtures[1]).toMatchObject({ won: 1, lost: null });
}, 15000);

it("omits rows without the minimum fields and rejects impossible textual dates", async () => {
  const data = await parseLeagueWorkbook(await variant((sheet) => {
    sheet.getCell("E2").value = " ";
    sheet.getCell("A3").value = "31/02/2030";
  }));
  expect(data.fixtures).toEqual([]);
  expect(data.skippedRows).toBe(2);
}, 15000);

it("accepts Spanish textual dates and missing optional columns, without guessing dates or time zones", async () => {
  const data = await parseLeagueWorkbook(await variant((sheet) => {
    sheet.getCell("A2").value = "1/12/2030";
    sheet.getCell("B2").value = "18:30";
    sheet.getCell("F1").value = null;
    sheet.getCell("G1").value = null;
  }));
  expect(data.fixtures.find((fixture) => fixture.opponent === "Club de prueba Norte")).toMatchObject({ date: "2030-12-01", time: "18:30", won: null, lost: null });
}, 15000);

it("requires the source headers rather than silently publishing an empty league after schema drift", async () => {
  await expect(parseLeagueWorkbook(await variant((sheet) => { sheet.getCell("E1").value = "different"; }))).rejects.toThrow(/Missing/);
}, 15000);

it("publishes optional standings as supplied without deriving missing figures", async () => {
  const data = await parseLeagueWorkbook(await variant((_sheet, book) => {
    const table = book.addWorksheet("Clasificación");
    table.addRow(["Posición", "Equipo", "Competición", "Categoría", "Grupo", "Puntos", "Partidos jugados"]);
    table.addRow([1, "Club de prueba", "Nacional", "Femenina", "Cataluña", 0]);
  }));
  expect(data.standings[0]).toMatchObject({ position: 1, points: 0, played: null, group: "Cataluña" });
}, 15000);

it("reads visible text and cached formula results without evaluating formulas", async () => {
  const data = await parseLeagueWorkbook(await variant((sheet) => {
    sheet.getCell("E2").value = { richText: [{ text: "Club " }, { text: "ficticio" }] };
    sheet.getCell("D2").value = { text: "Pista ficticia", hyperlink: "https://example.com/pista" };
    sheet.getCell("F2").value = { formula: "1+1", result: 2, shareType: "shared", ref: "F2:F3" };
    sheet.getCell("F3").value = { sharedFormula: "F2", result: 2 };
    sheet.getCell("G2").value = { formula: "1+1" };
    sheet.getCell("H2").value = { error: "#N/A" };
  }));
  expect(data.fixtures[0]).toMatchObject({ opponent: "Club ficticio", venue: "Pista ficticia", won: 2, lost: null, pairs: [null, null, null] });
  expect(data.fixtures[1].won).toBe(2);
}, 15000);

it("supports ISO dates, the 1904 date system, and optional fixture details", async () => {
  const data = await parseLeagueWorkbook(await variant((sheet, book) => {
    book.properties.date1904 = true;
    sheet.getCell("A2").value = "2030-11-02";
    sheet.getCell("A3").value = (Date.UTC(2030, 10, 3) - Date.UTC(1904, 0, 1)) / 86400000;
    sheet.getCell("B2").value = null;
    sheet.getCell("B3").value = "9:15:00";
    sheet.getCell("K1").value = "Estado";
    sheet.getCell("K2").value = "Aplazada";
    sheet.getCell("K3").value = "Cancelada";
    sheet.getCell("L1").value = "Dirección";
    sheet.getCell("L2").value = "Dirección ficticia";
    sheet.getCell("M1").value = "Jornada";
    sheet.getCell("M2").value = 2;
    sheet.getCell("N1").value = "Fase";
    sheet.getCell("N2").value = "Fase de prueba";
    sheet.getCell("D1").value = "Sede";
  }));
  expect(data.fixtures[0]).toMatchObject({ date: "2030-11-02", time: null, status: "postponed", round: "2", phase: "Fase de prueba", address: "Dirección ficticia", venue: "Pista de prueba Norte" });
  expect(data.fixtures[1]).toMatchObject({ date: "2030-11-03", time: "09:15", status: "cancelled" });
}, 15000);

it.each([true, new Date("2030-11-02T00:00:00Z"), "-1", "2.5", "texto", 100001])("leaves invalid match counts pending: %s", async (value) => {
  const data = await parseLeagueWorkbook(await variant((sheet) => {
    sheet.getCell("F2").value = value;
    sheet.getCell("G2").value = " 2 ";
  }));
  expect(data.fixtures[0]).toMatchObject({ won: null, lost: 2 });
}, 15000);

it.each(["24:00", "10:60", "not a time", ""])("does not guess invalid or empty times: %s", async (value) => {
  const data = await parseLeagueWorkbook(await variant((sheet) => { sheet.getCell("B2").value = value; }));
  expect(data.fixtures[0].time).toBeNull();
}, 15000);

it("skips missing teams and unrecognised dates without publishing incomplete fixtures", async () => {
  const data = await parseLeagueWorkbook(await variant((sheet) => {
    sheet.getCell("C2").value = null;
    sheet.getCell("A3").value = "11-03-2030";
  }));
  expect(data).toMatchObject({ fixtures: [], skippedRows: 2 });
}, 15000);

it("orders same-day fixtures by known time and then team, leaving unknown times last", async () => {
  const data = await parseLeagueWorkbook(await variant((sheet) => {
    sheet.getCell("A3").value = "2030-11-02";
    sheet.getCell("B2").value = null;
    sheet.getCell("B3").value = "09:15";
    sheet.addRow(["2030-11-02", "09:15", "Equipo de prueba A", null, "Club ficticio"]);
    sheet.addRow(["2030-11-02", null, "Equipo de prueba C", null, "Otro club ficticio"]);
  }));
  expect(data.fixtures.map(({ team, time }) => [team, time])).toEqual([
    ["Equipo de prueba A", "09:15"], ["Equipo de prueba B", "09:15"],
    ["Equipo de prueba A", null], ["Equipo de prueba C", null],
  ]);
}, 15000);

it("ignores hidden sheets and unrelated notes", async () => {
  const data = await parseLeagueWorkbook(await variant((_sheet, book) => {
    book.addWorksheet("Notas").addRow(["Información ficticia"]);
    const hidden = book.addWorksheet("Borrador", { state: "hidden" });
    hidden.addRow(["Fecha", "Equipo", "Oponente"]);
    hidden.addRow(["2030-11-04", "Borrador", "No publicar"]);
  }));
  expect(data.fixtures).toHaveLength(2);
  expect(data.skippedRows).toBe(0);
}, 15000);

it("rejects standings with missing required headers", async () => {
  const buffer = await variant((_sheet, book) => { book.addWorksheet("Clasificación").addRow(["Equipo", "Puntos"]); });
  await expect(parseLeagueWorkbook(buffer)).rejects.toThrow("Invalid Clasificacion headers");
}, 15000);

it("skips unranked standings rows and supports competition-code headers and pending statistics", async () => {
  const data = await parseLeagueWorkbook(await variant((_sheet, book) => {
    const table = book.addWorksheet("Clasificación");
    table.addRow(["Posición", "Equipo", "Código competición", "Puntos", "Partidos jugados", "Partidos ganados", "Partidos perdidos"]);
    table.addRow([0, "Sin posición"]);
    table.addRow([1, null]);
    table.addRow([2, "Club ficticio", "PRUEBA", 0, 0, 0, 0]);
    table.addRow([3, "Otro club ficticio"]);
  }));
  expect(data.standings).toEqual([
    { position: 2, team: "Club ficticio", competition: "PRUEBA", category: null, group: null, points: 0, played: 0, won: 0, lost: 0 },
    { position: 3, team: "Otro club ficticio", competition: null, category: null, group: null, points: null, played: null, won: null, lost: null },
  ]);
}, 15000);

it("rejects an oversized workbook before attempting to parse it", async () => {
  await expect(parseLeagueWorkbook(new Uint8Array(5 * 1024 * 1024 + 1))).rejects.toThrow("League workbook is too large");
});

it("rejects sheets that exceed the supported row limit", async () => {
  const buffer = await variant((sheet) => { sheet.getCell("A5001").value = "Outside the row limit"; });
  await expect(parseLeagueWorkbook(buffer)).rejects.toThrow("Too many league rows");
}, 15000);
