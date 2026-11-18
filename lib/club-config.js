const CONFIG_HOSTS = new Set(["global-config.vercel.com", "edge-config.vercel.com"]);

export function publicBlobUrl(value, extension) {
  const url = new URL(value);
  if (url.protocol !== "https:" || !url.hostname.endsWith(".public.blob.vercel-storage.com") ||
      url.username || url.password || url.port || !url.pathname.toLowerCase().endsWith(extension)) {
    throw new Error("Invalid public Vercel Blob document.");
  }
  url.hash = "";
  return url;
}

export async function readClubConfig() {
  const connection = process.env.GLOBAL_CONFIG || process.env.EDGE_CONFIG;
  if (!connection) return null;
  const url = new URL(connection);
  const token = url.searchParams.get("token");
  if (url.protocol !== "https:" || !CONFIG_HOSTS.has(url.hostname) ||
      url.username || url.password || url.port || !token) {
    throw new Error("Invalid Global Config connection.");
  }
  url.pathname = url.pathname.replace(/\/$/, "") + "/item/clubSeason";
  url.search = "?version=1";
  url.hash = "";
  const response = await fetch(url, {
    headers: { Authorization: "Bearer " + token }, redirect: "error", signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error("Global Config request failed.");
  return response.json();
}
