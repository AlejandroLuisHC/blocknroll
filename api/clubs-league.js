import { publicBlobUrl, readClubConfig } from "../lib/club-config.js";
import { parseLeagueWorkbook } from "../lib/league-workbook.js";

const MAX_BYTES = 5 * 1024 * 1024;
// Only the latest successful file is retained per warm instance. Config is always read first.
let cached;

async function readWorkbook(url) {
  const download = new URL(url);
  // Avoid a browser/CDN copy from a previous overwrite of the same Blob pathname.
  download.searchParams.set("league_refresh", String(Math.floor(Date.now() / 30000)));
  const response = await fetch(download.href, { redirect: "error", signal: AbortSignal.timeout(8000), cache: "no-store" });
  if (!response.ok || Number(response.headers.get("content-length")) > MAX_BYTES) throw new Error("Workbook unavailable.");
  const chunks = [];
  let length = 0;
  const reader = response.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BYTES) throw new Error("Workbook too large.");
      chunks.push(Buffer.from(value));
    }
  } finally {
    await reader.cancel();
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const config = await readClubConfig();
    if (!config?.documents?.clubs_league_data) return res.status(204).end();
    const url = publicBlobUrl(config.documents.clubs_league_data, ".xlsx").href;
    const now = Date.now();
    if (!cached || cached.url !== url || cached.expires <= now) {
      const { skippedRows, ...data } = await parseLeagueWorkbook(await readWorkbook(url));
      if (skippedRows) console.warn(`clubs-league: omitted ${skippedRows} incomplete row(s)`);
      cached = { url, expires: now + 30000, data };
    }
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=30");
    const month = (value) => typeof value === "string" && /^[12]\d{3}-(0[1-9]|1[0-2])$/.test(value) ? value : null;
    return res.status(200).json({ ...cached.data, season: { startsOn: month(config.startsOn), endsOn: month(config.endsOn) } });
  } catch {
    console.error("clubs-league: unable to load the configured workbook");
    return res.status(503).json({ error: "League information unavailable" });
  }
}
