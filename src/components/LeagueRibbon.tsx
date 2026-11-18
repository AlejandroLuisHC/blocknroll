import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { LEAGUE_COPY } from "../content/league";
import { languageFromPath, languagePath } from "../seo/site";
import { prefetchLeague } from "../data/league";

export default function LeagueRibbon() {
  const { pathname } = useLocation();
  const language = languageFromPath(pathname) ?? "es";
  const copy = LEAGUE_COPY[language];
  const container = useRef<HTMLElement>(null);
  const trackId = useId();
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let inView = false;
    const sync = () => setVisible(inView && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && document.visibilityState === "visible") prefetchLeague();
      sync();
    });
    if (container.current) observer.observe(container.current);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  return <aside className="league-ribbon" aria-label={copy.title} ref={container}>
    <Link className="league-ribbon-link" to={languagePath(language, "league")} aria-label={copy.followLink}
      onPointerEnter={prefetchLeague} onFocus={prefetchLeague} onTouchStart={prefetchLeague}>
      <span className="league-ribbon-track" id={trackId} aria-hidden="true" data-running={visible && !paused}>
        {[0, 1].map((group) => <span className="league-ribbon-group" key={group}>
          {[0, 1].map((phrase) => <span className="league-ribbon-phrase" key={phrase}>
            <span>{copy.follow}</span><ArrowUpRight size={32} /><span className="league-ribbon-competition">{copy.title}</span><ArrowUpRight size={32} />
          </span>)}
        </span>)}
      </span>
    </Link>
    <button className="league-ribbon-toggle" type="button" onClick={() => setPaused((value) => !value)}
      aria-label={paused ? copy.resumeRibbon : copy.pauseRibbon} aria-pressed={paused} aria-controls={trackId}>
      {paused ? <Play size={20} aria-hidden="true" /> : <Pause size={20} aria-hidden="true" />}
    </button>
  </aside>;
}
