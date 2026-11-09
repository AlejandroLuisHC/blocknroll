import { afterEach, beforeEach, expect, it, vi } from "vitest";
import handler from "../../api/club-season.js";

const config = {
  startsOn: "2027-09",
  endsOn: "2028-06",
  prices: { one_per_week: 45, two_per_week: 85, coachSupplement: 6, annualLicence: 38, processingFeePercent: 4 },
  documents: {
    guide: "https://example.public.blob.vercel-storage.com/guide.pdf",
    rules: "https://example.public.blob.vercel-storage.com/rules.pdf",
  },
};

function response() {
  return { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), json: vi.fn(), end: vi.fn() };
}

beforeEach(() => {
  vi.stubEnv("GLOBAL_CONFIG", undefined);
  vi.stubEnv("EDGE_CONFIG", undefined);
});

afterEach(() => vi.unstubAllEnvs());

it("uses the local-season signal before a store is connected", async () => {
  const res = response();
  await handler({ method: "GET" }, res);
  expect(res.status).toHaveBeenCalledWith(204);
  expect(res.end).toHaveBeenCalledOnce();
});

it("reads the season at runtime and returns only public fields", async () => {
  vi.stubEnv("GLOBAL_CONFIG", "https://global-config.vercel.com/ecfg_test?token=test-secret");
  const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
    Response.json({ ...config, internalNote: "private", prices: { ...config.prices, extra: 17 } }),
  );
  const res = response();

  await handler({ method: "GET" }, res);

  expect(fetchMock).toHaveBeenCalledWith(
    new URL("https://global-config.vercel.com/ecfg_test/item/clubSeason?version=1"),
    expect.objectContaining({ headers: { Authorization: "Bearer test-secret" } }),
  );
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.setHeader).toHaveBeenCalledWith("Cache-Control", "public, max-age=0, s-maxage=30");
  expect(res.json).toHaveBeenCalledWith({
    ...config,
    documents: {
      guide: config.documents.guide + "?download=1",
      rules: config.documents.rules + "?download=1",
    },
  });
});

it.each([
  { ...config, endsOn: "2027-01" },
  { ...config, prices: { ...config.prices, one_per_week: "45" } },
  { ...config, documents: { ...config.documents, guide: "https://example.com/guide.pdf" } },
])("rejects an invalid season instead of publishing it", async (invalidSeason) => {
  vi.stubEnv("GLOBAL_CONFIG", "https://global-config.vercel.com/ecfg_test?token=test-secret");
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(invalidSeason));
  vi.spyOn(console, "error").mockImplementation(() => {});
  const res = response();

  await handler({ method: "GET" }, res);

  expect(res.status).toHaveBeenCalledWith(503);
  expect(res.setHeader).toHaveBeenLastCalledWith("Cache-Control", "no-store");
  expect(res.json).toHaveBeenCalledWith({ error: "Season information unavailable" });
});
