import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CLUB_EMAIL, CLUB_NAME, INSTAGRAM_URL } from "../constants/club";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>
          <a className="wordmark" href="#home">
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
          <a className="footer-top" href="#home" aria-label={t("footer.top")}>
            <ArrowUp size={20} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
