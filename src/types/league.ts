export interface LeagueFixture {
  id: string;
  team: string;
  opponent: string;
  date: string;
  time: string | null;
  venue: string | null;
  address: string | null;
  won: number | null;
  lost: number | null;
  pairs: (string | null)[];
  status: "postponed" | "cancelled" | null;
  round: string | null;
  phase: string | null;
}

export interface LeagueStanding {
  team: string;
  position: number;
  competition: string | null;
  category: string | null;
  group: string | null;
  points: number | null;
  played: number | null;
  won: number | null;
  lost: number | null;
}

export interface LeagueData {
  fixtures: LeagueFixture[];
  standings: LeagueStanding[];
  season: { startsOn: string | null; endsOn: string | null };
}
