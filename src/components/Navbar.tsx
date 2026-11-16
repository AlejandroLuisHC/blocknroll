import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { CLUB_NAME } from "../constants/club";
import { languageFromPath, languagePath, pageFromPath } from "../seo/site";
import LanguageSelector from "./LanguageSelector";

const NAV_LINKS = [
  { key: "about", href: "#about" },
  { key: "gallery", href: "#gallery" },
  { key: "services", href: "#services" },
  { key: "contact", href: "#contact" },
] as const;

const Navbar = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const homePath = pageFromPath(pathname) === "home" ? "" : languagePath(languageFromPath(pathname) ?? "es");
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen) navigationRef.current?.querySelector("a")?.focus({ preventScroll: true });
  }, [isOpen]);

  return (
    <header className="site-header">
      <div
        className="shell header-inner"
        onKeyDown={(event) => {
          if (isOpen && event.key === "Escape") {
            setIsOpen(false);
            toggleRef.current?.focus({ preventScroll: true });
          }
        }}
      >
        <a className="wordmark" href={homePath + "#home"} onClick={() => setIsOpen(false)}>
          <img src="/brand-mark.avif" width="44" height="40" alt="" />
          <span translate="no">{CLUB_NAME}</span>
        </a>
        <nav
          ref={navigationRef}
          id="site-navigation"
          className="site-nav"
          aria-label={t("nav.main")}
          data-open={isOpen}
        >
          {NAV_LINKS.map(({ key, href }) => (
            <a key={key} href={homePath + href} className={key === "contact" ? "nav-contact" : undefined}
              onClick={() => setIsOpen(false)}>
              {t(`nav.${key}`)}
              {key === "contact" && <ArrowUpRight size={17} aria-hidden="true" />}
            </a>
          ))}
        </nav>
        <div className="header-controls">
          <LanguageSelector />
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-label={t(isOpen ? "nav.closeMenu" : "nav.openMenu")}
            aria-expanded={isOpen}
            aria-controls="site-navigation"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
