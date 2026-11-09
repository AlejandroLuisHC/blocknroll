const CONFIG_HOSTS = new Set(["global-config.vercel.com", "edge-config.vercel.com"]);
const MONTH = /^[12]\d{3}-(0[1-9]|1[0-2])$/;
const PRICE_FIELDS = ["one_per_week", "two_per_week", "coachSupplement", "annualLicence", "processingFeePercent"];

function blobDownload(value) {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    !url.hostname.endsWith(".public.blob.vercel-storage.com") ||
    url.username || url.password || url.port ||
    !url.pathname.toLowerCase().endsWith(".pdf")
  ) {
    throw new Error("Expected a public Vercel Blob PDF.");
  }
  url.search = "?download=1";
  url.hash = "";
  return url.href;
}

function publicSeason(value) {
  const { startsOn, endsOn, prices, documents } = value ?? {};
  if (
    typeof startsOn !== "string" || !MONTH.test(startsOn) ||
    typeof endsOn !== "string" || !MONTH.test(endsOn) ||
    startsOn > endsOn ||
    !PRICE_FIELDS.every((field) => Number.isFinite(prices?.[field]) && prices[field] >= 0)
  ) {
    throw new Error("Invalid season dates or prices.");
  }

  return {
    startsOn,
    endsOn,
    prices: Object.fromEntries(PRICE_FIELDS.map((field) => [field, prices[field]])),
    documents: {
      guide: blobDownload(documents?.guide),
      rules: blobDownload(documents?.rules),
    },
  };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const connection = process.env.GLOBAL_CONFIG || process.env.EDGE_CONFIG;
  if (!connection) {
    return res.status(204).end();
  }

  try {
    const url = new URL(connection);
    const token = url.searchParams.get("token");
    if (
      url.protocol !== "https:" || !CONFIG_HOSTS.has(url.hostname) ||
      url.username || url.password || url.port || !token
    ) {
      throw new Error("Invalid Global Config connection.");
    }

    url.pathname = url.pathname.replace(/\/$/, "") + "/item/clubSeason";
    url.search = "?version=1";
    url.hash = "";
    const response = await fetch(url, {
      headers: { Authorization: "Bearer " + token },
      redirect: "error",
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) {
      throw new Error("Global Config request failed.");
    }

    const season = publicSeason(await response.json());
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=30");
    return res.status(200).json(season);
  } catch {
    console.error("club-season: unable to read or validate the clubSeason item");
    return res.status(503).json({ error: "Season information unavailable" });
  }
}
