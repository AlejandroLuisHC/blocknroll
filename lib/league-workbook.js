import ExcelJS from "exceljs";

const DAY = 86400000;
const MAX_ROWS = 5000;
const MAX_BYTES = 5 * 1024 * 1024;
const normalize = (value) => String(value ?? "").trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

function scalar(value) {
  if (value === null || value === undefined) return null;
  if (typeof value !== "object" || value instanceof Date) return value;
  if ("formula" in value || "sharedFormula" in value) return scalar(value.result);
  if (value.richText) return value.richText.map((part) => part.text).join("");
  if (value.text) return value.text;
  return null;
}

const text = (value) => String(scalar(value) ?? "").trim().slice(0, 2000);
function count(value) {
  const raw = scalar(value);
  if (raw === null || raw === "" || typeof raw === "boolean" || raw instanceof Date) return null;
  const valueAsNumber = typeof raw === "string" && !/^\d+$/.test(raw.trim()) ? NaN : Number(raw);
  return Number.isSafeInteger(valueAsNumber) && valueAsNumber >= 0 && valueAsNumber <= 100000 ? valueAsNumber : null;
}

function dateValue(value, date1904) {
  let raw = scalar(value);
  if (typeof raw === "number") raw = new Date((Math.floor(raw) - (date1904 ? 24107 : 25569)) * DAY);
  if (raw instanceof Date) return Number.isFinite(raw.getTime()) ? raw.toISOString().slice(0, 10) : null;
  const input = text(raw);
  // Accept ISO dates and Spanish day/month/year text; never guess month/day order.
  let iso;
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) iso = input;
  else {
    const spanish = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(input);
    if (!spanish) return null;
    iso = `${spanish[3]}-${spanish[2].padStart(2, "0")}-${spanish[1].padStart(2, "0")}`;
  }
  const parsed = new Date(iso + "T00:00:00Z");
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === iso ? iso : null;
}

function timeValue(value) {
  const raw = scalar(value);
  if (raw === null || raw === "") return null;
  if (raw instanceof Date) return raw.toISOString().slice(11, 16);
  if (typeof raw === "number" && raw >= 0 && raw < 1) {
    const minutes = Math.round(raw * 1440) % 1440;
    return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  }
  const match = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(text(raw));
  return match && Number(match[1]) < 24 && Number(match[2]) < 60 ? `${match[1].padStart(2, "0")}:${match[2]}` : null;
}

function records(sheet, required) {
  if (sheet.rowCount > MAX_ROWS) throw new Error("Too many league rows.");
  const header = sheet.getRow(1);
  const columns = new Map();
  header.eachCell((cell, index) => columns.set(normalize(text(cell.value)), index));
  if (!required.every((key) => columns.has(key))) return null;
  const rows = [];
  sheet.eachRow((row, index) => {
    if (index === 1) return;
    rows.push({ index, get: (...keys) => {
      const key = keys.find((candidate) => columns.has(candidate));
      return key ? row.getCell(columns.get(key)).value : null;
    } });
  });
  return rows;
}

export async function parseLeagueWorkbook(buffer) {
  if (buffer.byteLength > MAX_BYTES) throw new Error("League workbook is too large.");
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const fixtures = [];
  let found = false;
  let skippedRows = 0;
  for (const sheet of workbook.worksheets.filter((sheet) => sheet.state === "visible")) {
    const rows = records(sheet, ["fecha", "equipo", "oponente"]);
    if (!rows) continue;
    found = true;
    for (const row of rows) {
      const team = text(row.get("equipo"));
      const opponent = text(row.get("oponente"));
      const date = dateValue(row.get("fecha"), workbook.properties.date1904);
      if (!team || !opponent || !date) { skippedRows++; continue; }
      const status = normalize(text(row.get("estado")));
      fixtures.push({
        id: `${sheet.id}-${row.index}`, team, opponent, date,
        time: timeValue(row.get("hora")), venue: text(row.get("venue", "sede")) || null,
        address: text(row.get("direccion")) || null,
        won: count(row.get("partidosganados")), lost: count(row.get("partidosperdidos")),
        pairs: [1, 2, 3].map((number) => text(row.get(`pareja${number}`)) || null),
        status: status === "aplazada" ? "postponed" : status === "cancelada" ? "cancelled" : null,
        round: text(row.get("jornada")) || null, phase: text(row.get("fase")) || null,
      });
    }
  }
  if (!found) throw new Error("Missing FECHA, EQUIPO or OPONENTE columns.");
  fixtures.sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? "99").localeCompare(b.time ?? "99") || a.team.localeCompare(b.team));
  const standings = [];
  const table = workbook.worksheets.find((sheet) => sheet.state === "visible" && normalize(sheet.name) === "clasificacion");
  if (table) {
    const rows = records(table, ["equipo", "posicion"]);
    if (!rows) throw new Error("Invalid Clasificacion headers.");
    for (const row of rows) {
      const team = text(row.get("equipo"));
      const position = count(row.get("posicion"));
      if (!team || !position) continue;
      standings.push({ team, position, competition: text(row.get("competicion", "codigocompeticion")) || null,
        category: text(row.get("categoria")) || null, group: text(row.get("grupo")) || null,
        points: count(row.get("puntos")), played: count(row.get("partidosjugados")),
        won: count(row.get("partidosganados")), lost: count(row.get("partidosperdidos")) });
    }
  }
  return { fixtures, standings, skippedRows };
}
