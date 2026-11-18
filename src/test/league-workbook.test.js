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
