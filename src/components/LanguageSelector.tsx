import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Globe } from "lucide-react";
import type { SupportedLanguage } from "../types";

interface Language {
  code: SupportedLanguage;
  name: string;
  flagCode: string;
}

const LANGUAGES: readonly Language[] = [
  { code: "es", name: "Español", flagCode: "es" },
  { code: "ca", name: "Català", flagCode: "es-ct" },
  { code: "en", name: "English", flagCode: "gb" },
] as const;

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  const handleLanguageChange = useCallback(
    (languageCode: SupportedLanguage) => {
      i18n.changeLanguage(languageCode);
      setIsOpen(false);
    },
    [i18n]
  );

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm d-flex align-items-center"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe size={16} className="me-2" aria-hidden="true" />
        <span className="small fw-medium d-flex align-items-center">
          <span
            className={`fi fi-${currentLanguage.flagCode} me-2`}
            style={{ fontSize: "1.2em" }}
            aria-hidden="true"
          ></span>
          <span className="d-none d-sm-inline">{currentLanguage.name}</span>
        </span>
        <ChevronDown
          size={16}
          className={`ms-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="language-dropdown mt-1"
          role="menu"
          aria-label="Language options"
        >
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              type="button"
              className={`btn btn-link text-start w-100 d-flex align-items-center px-3 py-2 text-decoration-none border-0 ${
                currentLanguage.code === language.code
                  ? "bg-light text-primary"
                  : "text-dark"
              }`}
              onClick={() => handleLanguageChange(language.code)}
              role="menuitem"
              aria-current={
                currentLanguage.code === language.code ? "true" : "false"
              }
            >
              <span
                className={`fi fi-${language.flagCode} me-3`}
                style={{ fontSize: "1.2em" }}
                aria-hidden="true"
              ></span>
              <span className="fw-medium">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
