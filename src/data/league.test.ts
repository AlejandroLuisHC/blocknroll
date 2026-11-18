import { afterEach, beforeEach, expect, it, vi } from "vitest";

let league: typeof import("./league");
const data = { fixtures: [], standings: [], season: {} };
beforeEach(async () => { vi.resetModules(); league = await import("./league"); });
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

it("reuses data for 30 seconds and then reads updated fixtures", async () => {
  vi.useFakeTimers();
  const updated = { ...data, fixtures: [{ id: "new" }] };
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(Response.json(data)).mockResolvedValueOnce(Response.json(updated));
  await league.loadLeague();
  await league.loadLeague();
  expect(fetch).toHaveBeenCalledTimes(1);
  await vi.advanceTimersByTimeAsync(30000);
  expect(await league.loadLeague()).toMatchObject({ data: updated });
  expect(fetch).toHaveBeenCalledTimes(2);
});

it("does not cache failures and permits recovery after unsuccessful prefetch", async () => {
  const fetch = vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(Response.json(data));
  await expect(league.loadLeague()).rejects.toThrow();
  expect(league.cachedLeague()).toBeUndefined();
  expect(await league.loadLeague()).toMatchObject({ data });
  expect(fetch).toHaveBeenCalledTimes(2);
});

it("does not carry removed publications into later visits", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(Response.json(data)).mockResolvedValueOnce(new Response(null, { status: 204 }));
  await league.loadLeague();
  await league.loadLeague(true);
  expect(league.cachedLeague()).toEqual({ status: "unpublished" });
});
