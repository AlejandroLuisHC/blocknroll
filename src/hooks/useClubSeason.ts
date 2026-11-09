import { useEffect, useState } from "react";
import { DEFAULT_SEASON } from "../constants/defaultSeason";
import type { ClubSeason } from "../types";

// Undefined means the initial request is pending. Null means the season is unavailable.
export function useClubSeason(): ClubSeason | null | undefined {
  const [season, setSeason] = useState<ClubSeason | null>();

  useEffect(() => {
    const controller = new AbortController();

    async function loadSeason() {
      try {
        const response = await fetch("/api/club-season", {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        // Vite can serve the page without a Functions runtime.
        const staticPreview = response.ok && response.headers.get("Content-Type")?.startsWith("text/html");
        if (response.status === 204 || response.status === 404 || staticPreview) {
          if (!controller.signal.aborted) setSeason(DEFAULT_SEASON);
          return;
        }

        if (!response.ok) throw new Error("Season unavailable");
        const content: ClubSeason = await response.json();
        if (!controller.signal.aborted) setSeason(content);
      } catch {
        if (!controller.signal.aborted) setSeason(null);
      }
    }

    void loadSeason();
    return () => controller.abort();
  }, []);

  return season;
}
