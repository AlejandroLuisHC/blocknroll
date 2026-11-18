import { useEffect, useState } from "react";
import type { LeagueData } from "../types/league";
import { cachedLeague, loadLeague } from "../data/league";

type LeagueState = { status: "loading" | "error" | "unpublished" } | { status: "ready"; data: LeagueData; refreshError: boolean };

export function useLeague() {
  const [state, setState] = useState<LeagueState>(() => {
    const cached = cachedLeague();
    return cached?.status === "ready" ? { ...cached, refreshError: false } : cached ?? { status: "loading" };
  });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    async function load(force = false) {
      try {
        const publication = await loadLeague(force);
        if (active) setState(publication.status === "ready" ? { ...publication, refreshError: false } : publication);
      } catch {
        if (active) setState((previous) => previous.status === "ready" ? { ...previous, refreshError: true } : { status: "error" });
      }
    }
    void load(attempt > 0);
    const refresh = () => { if (document.visibilityState === "visible") void load(); };
    const interval = window.setInterval(refresh, 60000);
    document.addEventListener("visibilitychange", refresh);
    return () => { active = false; window.clearInterval(interval); document.removeEventListener("visibilitychange", refresh); };
  }, [attempt]);
  return { state, retry: () => { setState({ status: "loading" }); setAttempt((value) => value + 1); } };
}
