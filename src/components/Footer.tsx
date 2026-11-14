import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { CLUB_EMAIL, CLUB_NAME, INSTAGRAM_URL } from "../constants/club";
import { LANGUAGES, LANGUAGE_NAMES, languageFromPath, languagePath } from "../seo/site";

const Footer = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const homePath = languageFromPath(pathname) ? "" : "/";

  return (
    <footer className="site-footer">
      <div className="shell footer-signoff" aria-hidden="true">Block n’ Roll</div>
      <div className="shell footer-inner">
        <div>
          <a className="wordmark" href={homePath + "#home"}>
            <img src="/brand-mark.avif" width="44" height="40" alt="" loading="lazy" />
            <span>{CLUB_NAME}</span>
          </a>
          <p>{t("footer.description")}</p>
        </div>
        <div className="footer-links">
          <a href={"mailto:" + CLUB_EMAIL}>{t("contact.emailLabel")}</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Instagram <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a className="footer-top" href={homePath + "#home"} aria-label={t("footer.top")}>
            <ArrowUp size={20} aria-hidden="true" />
          </a>
        </div>
      </div>
      <nav className="shell footer-languages" aria-label={t("nav.language")}>
        {LANGUAGES.map((language) => (
          <Link key={language} to={languagePath(language)} hrefLang={language} lang={language}>
            {LANGUAGE_NAMES[language]}
          </Link>
        ))}
      </nav>
    </footer>
  );
};

export default Footer;
