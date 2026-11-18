import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ChevronDown, Clock3, MapPin } from "lucide-react";
import { LEAGUE_COPY } from "../content/league";
import { useLeague } from "../hooks/useLeague";
import { languagePath, type SiteLanguage } from "../seo/site";
import type { LeagueFixture, LeagueStanding } from "../types/league";

const locale = { es: "es-ES", ca: "ca-ES", en: "en-GB" };
const todayInBarcelona = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Madrid" }).format(new Date());
const complete = (fixture: LeagueFixture) => fixture.won !== null && fixture.lost !== null;

function Fixture({ fixture, language, today }: { fixture: LeagueFixture; language: SiteLanguage; today: string }) {
  const copy = LEAGUE_COPY[language];
  const status = fixture.status ?? (complete(fixture) ? "final" : fixture.date < today ? "pendingResult" : "scheduled");
  const date = new Date(fixture.date + "T12:00:00Z");
  const location = [fixture.venue, fixture.address].filter(Boolean).join(" · ");
  return (
    <li className="league-fixture">
      <div className="fixture-main">
        <time className="fixture-date" dateTime={fixture.date} aria-label={new Intl.DateTimeFormat(locale[language], { dateStyle: "full", timeZone: "UTC" }).format(date)}>
          <span className="fixture-month">{new Intl.DateTimeFormat(locale[language], { month: "short", timeZone: "UTC" }).format(date)} {date.getUTCFullYear()}</span>
          <span className="fixture-day">{date.getUTCDate()}</span>
          <span className="fixture-weekday">{new Intl.DateTimeFormat(locale[language], { weekday: "short", timeZone: "UTC" }).format(date)}</span>
        </time>
        <div className="fixture-teams">
          <p className="fixture-team">{fixture.team}</p>
          <p className="fixture-club">Block n’ Roll</p>
          <h3><span className="fixture-vs">{copy.vs} </span>{fixture.opponent}</h3>
          {(fixture.phase || fixture.round) && <p>{[fixture.phase, fixture.round && `${copy.round} ${fixture.round}`].filter(Boolean).join(" · ")}</p>}
          <div className="fixture-meta"><span className="fixture-time"><Clock3 size={15} aria-hidden="true" />{fixture.time ?? copy.timePending}</span>
            <span className="fixture-status" data-status={status}>{copy[status]}</span>
          </div>
          {fixture.status !== "cancelled" && (fixture.won !== null || fixture.lost !== null) && <>
            <div className="fixture-result">
            <p className="fixture-score" aria-label={`Block n’ Roll: ${fixture.won ?? copy.pending}; ${fixture.opponent}: ${fixture.lost ?? copy.pending}`}>
              {fixture.won ?? "—"}<span aria-hidden="true">–</span>{fixture.lost ?? "—"}
            </p>
            <span>{copy.games}</span>
            </div>
          </>}
        </div>
      </div>
      <div className="fixture-location">
        <p className="fixture-venue"><MapPin size={16} aria-hidden="true" /><span>{location || copy.venuePending}</span></p>
        {location && <a className="text-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`} target="_blank" rel="noopener noreferrer">
          {copy.directions}<ArrowUpRight size={15} aria-hidden="true" />
        </a>}
      </div>
      <details className="fixture-lineup">
        <summary>{copy.lineup}<ChevronDown size={18} aria-hidden="true" /></summary>
        <dl>{fixture.pairs.map((pair, index) => <div key={index}><dt>{copy.pair} {index + 1}</dt><dd>{pair ?? copy.pending}</dd></div>)}</dl>
      </details>
    </li>
  );
}

function Standings({ rows, language }: { rows: LeagueStanding[]; language: SiteLanguage }) {
  const copy = LEAGUE_COPY[language];
  const groups = new Map<string, LeagueStanding[]>();
  for (const row of rows) {
    const key = JSON.stringify([row.competition, row.category, row.group]);
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  return <>{[...groups].map(([key, group]) => {
    const label = [group[0].competition, group[0].category, group[0].group].filter(Boolean).join(" · ");
    return <div className="league-table-wrap" key={key} role="region" aria-label={label || copy.standings} tabIndex={0}>
      <table className="league-table">
        <caption>{label || copy.standings}</caption>
        <thead><tr>{[copy.position, copy.club, copy.points, copy.played, copy.won, copy.lost].map((title) => <th scope="col" key={title}>{title}</th>)}</tr></thead>
        <tbody>{[...group].sort((a, b) => a.position - b.position).map((row, index) => <tr key={index}>
          <td>{row.position}</td><th scope="row">{row.team}</th>{[row.points, row.played, row.won, row.lost].map((value, cell) => <td key={cell}>{value ?? "—"}</td>)}
        </tr>)}</tbody>
      </table>
    </div>;
  })}<p className="league-table-hint">{copy.scrollTable}</p><p className="league-note">{copy.standingsNote}</p></>;
}

export default function LeaguePage({ language }: { language: SiteLanguage }) {
  const copy = LEAGUE_COPY[language];
  const { state, retry } = useLeague();
  const [team, setTeam] = useState("");
  const data = state.status === "ready" ? state.data : null;
  const today = todayInBarcelona();
  const teams = [...new Set(data?.fixtures.map((fixture) => fixture.team) ?? [])];
  const selectedTeam = teams.includes(team) ? team : "";
  const fixtures = (data?.fixtures ?? []).filter((fixture) => !selectedTeam || fixture.team === selectedTeam);
  const upcoming = fixtures.filter((fixture) => !complete(fixture) && (fixture.date >= today || fixture.status === "postponed"));
  const past = fixtures.filter((fixture) => !upcoming.includes(fixture)).sort((a, b) => b.date.localeCompare(a.date));
  const season = data?.season;
  const seasonLabel = season?.startsOn && season?.endsOn ? `${season.startsOn.slice(0, 4)}–${season.endsOn.slice(2, 4)}` : null;

  return <div className="league-page" id="league-top">
    <header className="league-heading">
      <div className="shell league-heading-inner">
        <div className="league-heading-meta">
        <Link className="text-link league-back" to={languagePath(language)}><ArrowLeft size={17} aria-hidden="true" />{copy.home}</Link>
        {seasonLabel && <p className="league-season">{copy.season} {seasonLabel}</p>}
        </div>
        <h1>{copy.title}</h1>
      </div>
    </header>
    <div className="shell league-content">
      {data && <div className="league-toolbar">
        <nav className="league-sections" aria-label={copy.title}>
          <a href="#league-calendar">{copy.agenda}</a><a href="#league-results">{copy.results}</a><a href="#league-standings">{copy.standings}</a>
        </nav>
      </div>}
      <div role="status" className="league-load-state">
        {state.status === "loading" && <div className="league-loading"><p>{copy.loading}</p><div className="league-loading-card" aria-hidden="true"><span /><span /><span /></div></div>}
        {state.status === "unpublished" && <p>{copy.notPublished}</p>}
        {state.status === "ready" && state.refreshError && <p>{copy.refreshError}</p>}
      </div>
      {state.status === "error" && <div className="league-error" role="alert"><p>{copy.unavailable}</p><button className="button button-primary" type="button" onClick={retry}>{copy.retry}</button></div>}
      {data && <>
        <section className="league-section" id="league-calendar" aria-labelledby="league-calendar-title">
          <div className="league-section-heading">
            <h2 id="league-calendar-title">{copy.calendar}</h2>
            {teams.length > 0 && <div className="league-filter"><label htmlFor="league-team">{copy.teams}</label>
              <select id="league-team" value={selectedTeam} onChange={(event) => setTeam(event.target.value)}><option value="">{copy.allTeams}</option>{teams.map((name) => <option key={name}>{name}</option>)}</select>
            </div>}
          </div>
          {upcoming.length ? <ul className="league-fixtures">{upcoming.map((fixture) => <Fixture key={fixture.id} fixture={fixture} language={language} today={today} />)}</ul> : <p className="league-empty">{copy.emptyCalendar}</p>}
        </section>
        <section className="league-section" id="league-results" aria-labelledby="league-results-title">
          <h2 id="league-results-title">{copy.results}</h2>
          {past.length ? <ul className="league-fixtures">{past.map((fixture) => <Fixture key={fixture.id} fixture={fixture} language={language} today={today} />)}</ul> : <p className="league-empty">{copy.emptyResults}</p>}
        </section>
        <section className="league-section" id="league-standings" aria-labelledby="league-standings-title">
          <h2 id="league-standings-title">{copy.standings}</h2>
          {data.standings.length ? <Standings rows={data.standings} language={language} /> : <p className="league-empty">{copy.emptyStandings}</p>}
        </section>
      </>}
    </div>
  </div>;
}
