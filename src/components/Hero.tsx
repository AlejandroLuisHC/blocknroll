import { ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CLUB_NAME } from "../constants/club";
import type { ClubSeason } from "../types";

const Hero = ({ onTrial, season }: { onTrial: () => void; season: ClubSeason | null | undefined }) => {
  const { t } = useTranslation();
  const startYear = season?.startsOn.slice(0, 4);
  const endYear = season?.endsOn.slice(0, 4);
  const seasonLabel = startYear && endYear && (
    startYear === endYear ? startYear : startYear.slice(2) + "/" + endYear.slice(2)
  );

  return (
    <section id="home" className="hero" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="hero-stage">
        <figure className="hero-visual">
          <picture>
            <source media="(max-width: 720px)" srcSet="/court-mobile.avif" />
            <img src="/court.avif" alt={t("hero.photoAlt")} width="1120" height="896" fetchPriority="high" />
          </picture>
        </figure>
        <div className="shell hero-content">
          <p className="hero-brand" translate="no">{CLUB_NAME}</p>
          <h1 id="hero-title" className="hero-title">{t("hero.headline")} {t("hero.city")}</h1>
          <p className="hero-intro">{t("hero.community")}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#about">
              {t("hero.discover")} <ArrowDown size={18} aria-hidden="true" />
            </a>
            <a className="text-link" href="#contact" onClick={onTrial}>{t("hero.trial")}</a>
          </div>
          <a className="hero-training text-link" href="#services">{t("hero.training")}</a>
        </div>
      </div>
      <div className="hero-signature">
        <span aria-hidden="true">We will Block n’ Roll!</span>
        <span>{seasonLabel ? `${t("hero.facts.season")} ${seasonLabel}` : "Beach volley club"}</span>
      </div>
    </section>
  );
};

export default Hero;
