import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
let useLeague: typeof import("./useLeague").useLeague;
beforeEach(async () => { vi.resetModules(); useLeague = (await import("./useLeague")).useLeague; });

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });
it("refreshes an open visible page, retaining the last data if a refresh fails", async () => {
  vi.useFakeTimers();
  const first = { fixtures: [], standings: [], season: {} };
  const second = { ...first, fixtures: [{ id: "new" }] };
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(Response.json(first)).mockResolvedValueOnce(Response.json(second)).mockRejectedValue(new Error("offline"));
  const { result, unmount } = renderHook(useLeague);
  await act(async () => { await vi.advanceTimersByTimeAsync(1); });
  expect(result.current.state).toMatchObject({ status: "ready", data: first });
  await act(async () => { await vi.advanceTimersByTimeAsync(60000); });
  expect(result.current.state).toMatchObject({ status: "ready", data: second });
  await act(async () => { await vi.advanceTimersByTimeAsync(60000); });
  expect(result.current.state).toMatchObject({ status: "ready", data: second, refreshError: true });
  expect(fetch).toHaveBeenCalledTimes(3);
  unmount();
  await vi.advanceTimersByTimeAsync(60000);
  expect(fetch).toHaveBeenCalledTimes(3);
});

it("renders prefetched data immediately and shares a navigation request with the mounted page", async () => {
  const data = { fixtures: [], standings: [], season: {} };
  let respond!: (response: Response) => void;
  const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(() => new Promise((resolve) => { respond = resolve; }));
  const { prefetchLeague, loadLeague } = await import("../data/league");
  prefetchLeague();
  const first = renderHook(useLeague);
  expect(fetch).toHaveBeenCalledTimes(1);
  await act(async () => { respond(Response.json(data)); await loadLeague(); });
  expect(first.result.current.state).toMatchObject({ status: "ready", data });
  first.unmount();
  const second = renderHook(useLeague);
  expect(second.result.current.state).toMatchObject({ status: "ready", data });
  expect(fetch).toHaveBeenCalledTimes(1);
  second.unmount();
});
