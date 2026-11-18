import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { publicBlobUrl, readClubConfig } from "../../lib/club-config.js";

beforeEach(() => { vi.stubEnv("GLOBAL_CONFIG", undefined); vi.stubEnv("EDGE_CONFIG", undefined); });
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

it("does not make a request before a config connection is supplied", async () => {
  const fetch = vi.spyOn(globalThis, "fetch");
  expect(await readClubConfig()).toBeNull();
  expect(fetch).not.toHaveBeenCalled();
});

it("supports the legacy connection and keeps its token out of the requested URL", async () => {
  vi.stubEnv("EDGE_CONFIG", "https://edge-config.vercel.com/test/?token=fake-secret#fragment");
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ startsOn: "2030-09" }));
  expect(await readClubConfig()).toEqual({ startsOn: "2030-09" });
  const [url, options] = fetch.mock.calls[0];
  expect(url.href).toBe("https://edge-config.vercel.com/test/item/clubSeason?version=1");
  expect(options.headers).toEqual({ Authorization: "Bearer fake-secret" });
  expect(options.redirect).toBe("error");
});

it.each([
  "http://global-config.vercel.com/test?token=fake",
  "https://example.com/test?token=fake",
  "https://user:password@global-config.vercel.com/test?token=fake",
  "https://global-config.vercel.com:444/test?token=fake",
  "https://global-config.vercel.com/test",
])("rejects an unsafe config connection before making a request: %s", async (connection) => {
  vi.stubEnv("GLOBAL_CONFIG", connection);
  const fetch = vi.spyOn(globalThis, "fetch");
  await expect(readClubConfig()).rejects.toThrow("Invalid Global Config connection");
  expect(fetch).not.toHaveBeenCalled();
});

it("does not return an upstream error page as configuration", async () => {
  vi.stubEnv("GLOBAL_CONFIG", "https://global-config.vercel.com/test?token=fake");
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("unavailable", { status: 503 }));
  await expect(readClubConfig()).rejects.toThrow("Global Config request failed");
});

it("keeps public blob query parameters and accepts extension case without a fragment", () => {
  expect(publicBlobUrl("https://example.public.blob.vercel-storage.com/LEAGUE.XLSX?v=2#sheet", ".xlsx").href)
    .toBe("https://example.public.blob.vercel-storage.com/LEAGUE.XLSX?v=2");
});

it.each([
  "http://example.public.blob.vercel-storage.com/league.xlsx",
  "https://example.public.blob.vercel-storage.com.evil.example/league.xlsx",
  "https://user:password@example.public.blob.vercel-storage.com/league.xlsx",
  "https://example.public.blob.vercel-storage.com:444/league.xlsx",
  "https://example.public.blob.vercel-storage.com/league.xlsx.exe",
])("rejects a blob URL outside the public document contract: %s", (url) => {
  expect(() => publicBlobUrl(url, ".xlsx")).toThrow("Invalid public Vercel Blob document");
});
