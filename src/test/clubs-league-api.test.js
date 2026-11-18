import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createLeagueWorkbookBuffer } from "./helpers/league-workbook.js";

const url = "https://example.public.blob.vercel-storage.com/league.xlsx";
const config = { startsOn: "2030-09", endsOn: "2031-09", documents: { clubs_league_data: url } };
function response() { return { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), json: vi.fn(), end: vi.fn() }; }
let handler;
beforeEach(async () => {
  vi.resetModules();
  vi.stubEnv("GLOBAL_CONFIG", "https://global-config.vercel.com/test?token=private");
  vi.stubEnv("EDGE_CONFIG", undefined);
  // Isolate the handler cache; give cold module loading its own setup budget.
  handler = (await import("../../api/clubs-league.js")).default;
}, 15000);
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });

it("loads the configured workbook server-side and returns only public data", async () => {
  const buffer = await createLeagueWorkbookBuffer();
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(Response.json(config)).mockResolvedValueOnce(new Response(buffer));
  const res = response();
  await handler({ method: "GET" }, res);
  expect(res.status).toHaveBeenCalledWith(200);
  const data = res.json.mock.calls[0][0];
  expect(data.fixtures).toHaveLength(2);
  expect(JSON.stringify(data)).not.toContain("private");
  expect(data.fixtures[0].won).toBeNull();
  expect(fetch.mock.calls[1][0]).toMatch(url + "?league_refresh=");
  expect(fetch.mock.calls[1][1]).not.toHaveProperty("headers.Authorization");
  fetch.mockResolvedValueOnce(Response.json({ ...config, documents: { clubs_league_data: url + "?v=2" } })).mockResolvedValueOnce(new Response(buffer));
  await handler({ method: "GET" }, response());
  expect(fetch).toHaveBeenCalledTimes(4);
}, 15000);

it("returns unpublished when the document is not configured", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(Response.json({ documents: {} }));
  const res = response();
  await handler({ method: "GET" }, res);
  expect(res.status).toHaveBeenCalledWith(204);
});

it.each(["https://example.com/league.xlsx", "https://example.public.blob.vercel-storage.com/league.pdf"])("rejects an unexpected workbook URL: %s", async (badUrl) => {
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(Response.json({ documents: { clubs_league_data: badUrl } }));
  vi.spyOn(console, "error").mockImplementation(() => {});
  const res = response();
  await handler({ method: "GET" }, res);
  expect(res.status).toHaveBeenCalledWith(503);
  expect(fetch).toHaveBeenCalledOnce();
});

it("does not turn a broken workbook into a successful empty calendar", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(Response.json(config)).mockResolvedValueOnce(new Response("broken workbook"));
  vi.spyOn(console, "error").mockImplementation(() => {});
  const res = response();
  await handler({ method: "GET" }, res);
  expect(res.status).toHaveBeenCalledWith(503);
  expect(res.setHeader).toHaveBeenCalledWith("Cache-Control", "no-store");
});

it("rejects unsupported methods without accessing the config or workbook", async () => {
  const fetch = vi.spyOn(globalThis, "fetch");
  const res = response();
  await handler({ method: "POST" }, res);
  expect(res.status).toHaveBeenCalledWith(405);
  expect(res.setHeader).toHaveBeenCalledWith("Allow", "GET");
  expect(fetch).not.toHaveBeenCalled();
});

it("reuses a recent workbook, then refreshes it after the cache expires", async () => {
  const first = await createLeagueWorkbookBuffer();
  const updated = await createLeagueWorkbookBuffer(sheet => { sheet.getCell("F2").value = 0; });
  const now = vi.spyOn(Date, "now").mockReturnValue(2000000000000);
  const fetch = vi.spyOn(globalThis, "fetch")
    .mockResolvedValueOnce(Response.json(config)).mockResolvedValueOnce(new Response(first))
    .mockResolvedValueOnce(Response.json(config))
    .mockResolvedValueOnce(Response.json(config)).mockResolvedValueOnce(new Response(updated));
  await handler({ method: "GET" }, response());
  await handler({ method: "GET" }, response());
  expect(fetch).toHaveBeenCalledTimes(3);
  now.mockReturnValue(2000000030001);
  const res = response();
  await handler({ method: "GET" }, res);
  expect(fetch).toHaveBeenCalledTimes(5);
  expect(res.json.mock.calls[0][0].fixtures[0].won).toBe(0);
}, 15000);

it.each([
  { status: 404 },
  { status: 200, headers: { "Content-Length": String(5 * 1024 * 1024 + 1) } },
])("rejects a failed or oversized download: %j", async options => {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(Response.json(config)).mockResolvedValueOnce(new Response("not a workbook", options));
  vi.spyOn(console, "error").mockImplementation(() => {});
  const res = response();
  await handler({ method: "GET" }, res);
  expect(res.status).toHaveBeenCalledWith(503);
  expect(res.setHeader).not.toHaveBeenCalledWith("Cache-Control", expect.stringContaining("public"));
});

it("enforces the download limit even when Content-Length is absent", async () => {
  const cancel = vi.fn();
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(5 * 1024 * 1024 + 1)); }, cancel });
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(Response.json(config)).mockResolvedValueOnce(new Response(stream));
  vi.spyOn(console, "error").mockImplementation(() => {});
  const res = response();
  await handler({ method: "GET" }, res);
  expect(res.status).toHaveBeenCalledWith(503);
  expect(cancel).toHaveBeenCalledOnce();
});

it("reports skipped rows without exposing them and leaves invalid season dates pending", async () => {
  const buffer = await createLeagueWorkbookBuffer(sheet => { sheet.getCell("E3").value = ""; });
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(Response.json({ ...config, startsOn: 2030, endsOn: "2031-13" })).mockResolvedValueOnce(new Response(buffer));
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  const res = response();
  await handler({ method: "GET" }, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json.mock.calls[0][0]).toMatchObject({ season: { startsOn: null, endsOn: null } });
  expect(res.json.mock.calls[0][0].fixtures).toHaveLength(1);
  expect(res.json.mock.calls[0][0]).not.toHaveProperty("skippedRows");
  expect(warn).toHaveBeenCalledWith(expect.stringContaining("1 incomplete row"));
}, 15000);
