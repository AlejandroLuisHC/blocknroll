import ExcelJS from "exceljs";

// Fictitious data only. Each call creates a fresh workbook without reading files.
export function createLeagueWorkbook() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Synthetic test data";
  workbook.created = workbook.modified = new Date("2000-01-01T00:00:00Z");
  const sheet = workbook.addWorksheet("Hoja1");
  sheet.addRow(["FECHA", "HORA", "EQUIPO", "VENUE", "OPONENTE", "PARTIDOS GANADOS", "PARTIDOS PERDIDOS ", "PAREJA 1", "PAREJA 2 ", "PAREJA 3"]);
  sheet.addRow([new Date("2030-11-02T00:00:00Z"), 10 / 24, "Equipo de prueba A", "Pista de prueba Norte", "Club de prueba Norte"]);
  sheet.getCell("A2").numFmt = "dd/mm/yyyy";
  sheet.getCell("B2").numFmt = "hh:mm";
  // Also exercise raw Excel date/time serials, without date-formatted cells.
  const serial = (Date.UTC(2030, 10, 3) - Date.UTC(1899, 11, 30)) / 86400000;
  sheet.addRow([serial, 10 / 24, "Equipo de prueba B", "Pista de prueba Sur", "Club de prueba Sur"]);
  return workbook;
}

export async function createLeagueWorkbookBuffer(change = () => {}) {
  const workbook = createLeagueWorkbook();
  change(workbook.getWorksheet("Hoja1"), workbook);
  return workbook.xlsx.writeBuffer();
}
