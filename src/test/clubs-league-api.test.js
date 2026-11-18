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
