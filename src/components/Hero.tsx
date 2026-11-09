import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ClubSeason } from "../types";

const FACTS = [
  { value: "8", label: "players" },
  { value: "90′", label: "duration" },
] as const;

const Hero = ({ onTrial, season }: { onTrial: () => void; season: ClubSeason | null | undefined }) => {
  const { t } = useTranslation();
  const startYear = season?.startsOn.slice(0, 4);
  const endYear = season?.endsOn.slice(0, 4);
  const seasonLabel = startYear && endYear && (
    startYear === endYear ? startYear : startYear.slice(2) + "/" + endYear.slice(2)
  );

  return (
    <section id="home" className="hero" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="shell">
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="eyebrow">{t("hero.kicker")}</p>
            <h1 id="hero-title" className="hero-title">
              {t("hero.headline")} <span>{t("hero.city")}</span>
            </h1>
            <p className="hero-intro">{t("hero.intro")}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#services">
                {t("hero.training")} <ArrowDown size={18} aria-hidden="true" />
              </a>
              <a className="text-link" href="#contact" onClick={onTrial}>
                {t("hero.trial")} <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <figure className="hero-visual">
            <picture>
              <source media="(max-width: 720px)" srcSet="/court-mobile.avif" />
              <img
                src="/court.avif"
                alt={t("hero.photoAlt")}
                width="1120"
                height="896"
                fetchPriority="high"
              />
            </picture>
            <figcaption>
              <span>{t("hero.caption")}</span>
              <span aria-hidden="true">BNR / BCN</span>
            </figcaption>
          </figure>
        </div>
        <dl className="hero-facts">
          {FACTS.map(({ value, label }) => (
            <div key={label}>
              <dt>{t(`hero.facts.${label}`)}</dt>
              <dd>{value}</dd>
            </div>
          ))}
          <div>
            <dt>{t("hero.facts.season")}</dt>
            <dd>{seasonLabel ?? "—"}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default Hero;
