import guide from "../assets/docs/guia-club-2026-27.pdf";
import rules from "../assets/docs/normativa-club-2026-27.pdf";
import type { ClubSeason } from "../types";

export const DEFAULT_SEASON: ClubSeason = {
  startsOn: "2026-09",
  endsOn: "2027-06",
  prices: {
    one_per_week: 40,
    two_per_week: 75,
    coachSupplement: 5,
    annualLicence: 37,
    processingFeePercent: 4,
  },
  documents: { guide, rules },
};
