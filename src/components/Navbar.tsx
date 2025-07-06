import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { LanguageSelector } from "./";
import logoImage from "../assets/img/logo-no-bg-gpt.png";
import "../styles/components/navbar.css";

// Navigation items configuration
const NAV_SECTIONS = [
  { key: "home", href: "#home" },
  { key: "about", href: "#about" },
  { key: "services", href: "#services" },
  { key: "gallery", href: "#gallery" },
  { key: "contact", href: "#contact" },
] as const;

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = NAV_SECTIONS.map((section) => ({
    name: t(`nav.${section.key}`),
    href: section.href,
  }));

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top navbar-modern ${
        isScrolled ? "scrolled" : ""
      }`}
    >
      <div className="container">
        {/* Brand Logo */}
        <a
          className="navbar-brand d-flex align-items-center text-decoration-none"
          href="#home"
        >
          <div
            className="logo-container d-flex align-items-center justify-content-center me-3"
            style={{
              width: "auto",
              height: "auto",
              overflow: "hidden",
            }}
          >
            <img
              src={logoImage}
              alt="Block n' Roll Logo"
              style={{
                width: "clamp(40px, 8vw, 50px)",
                height: "clamp(40px, 8vw, 50px)",
                marginTop: "6px",
                objectFit: "contain",
              }}
            />
          </div>
          <div>
            <span
              className="fw-bold fs-4 brand-text"
              style={{ color: "var(--neutral-800)", lineHeight: 1.1 }}
            >
              {t("hero.title")}
            </span>
            <div
              className="text-xs text-muted d-none d-md-block"
              style={{ marginTop: "-2px", marginLeft: "1px" }}
            >
              Barcelona Beach Volleyball
            </div>
          </div>
        </a>

        {/* Mobile Controls */}
        <div className="d-flex align-items-center d-lg-none mobile-controls">
          <div className="me-2">
            <LanguageSelector />
          </div>
          <button
            className="btn btn-modern btn-ghost-modern hamburger-btn"
            type="button"
            onClick={toggleMenu}
            aria-label={isOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X size={18} aria-hidden="true" />
            ) : (
              <Menu size={18} aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-center">
            {navItems.map((item) => (
              <li key={item.name} className="nav-item">
                <a
                  className="nav-link nav-link-modern px-3 py-2 text-decoration-none"
                  href={item.href}
                  onClick={closeMenu}
                >
                  {item.name}
                </a>
              </li>
            ))}

            {/* Language Selector - Desktop */}
            <li className="nav-item d-none d-lg-block ms-3">
              <LanguageSelector />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
