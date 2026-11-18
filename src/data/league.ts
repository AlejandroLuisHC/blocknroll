import type { LeagueData } from "../types/league";

type Publication = { status: "ready"; data: LeagueData } | { status: "unpublished" };
const FRESH_FOR = 30000;
let cached: { publication: Publication; loadedAt: number } | undefined;
let inFlight: Promise<Publication> | undefined;

export function cachedLeague() {
  return cached?.publication;
}

export function loadLeague(force = false): Promise<Publication> {
  if (inFlight) return inFlight;
  if (!force && cached && Date.now() - cached.loadedAt < FRESH_FOR) return Promise.resolve(cached.publication);
  inFlight = (async () => {
    const response = await fetch("/api/clubs-league", {
      cache: "no-store", signal: AbortSignal.timeout(15000), headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("League unavailable");
    let publication: Publication;
    if (response.status === 204) publication = { status: "unpublished" };
    else {
      const data: LeagueData = await response.json();
      if (!Array.isArray(data.fixtures) || !Array.isArray(data.standings)) throw new Error("Invalid league data");
      publication = { status: "ready", data };
    }
    cached = { publication, loadedAt: Date.now() };
    return publication;
  })().finally(() => { inFlight = undefined; });
  return inFlight;
}

export function prefetchLeague() {
  // Navigation and the page share this request, including in React Strict Mode.
  void loadLeague().catch(() => { /* The page offers recovery if the request fails. */ });
}
