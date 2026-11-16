import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { languagePath, pageFromPath, type SiteLanguage } from "../seo/site";

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <select
      className="language-select"
      aria-label={t("nav.language")}
      value={i18n.resolvedLanguage ?? "es"}
      onChange={(event) => {
        const language = event.target.value as SiteLanguage;
        void i18n.changeLanguage(language);
        const page = pageFromPath(location.pathname) ?? "home";
        navigate(languagePath(language, page) + (page === "home" ? location.hash : ""));
      }}
    >
      <option value="es" lang="es">Español</option>
      <option value="ca" lang="ca">Català</option>
      <option value="en" lang="en">English</option>
    </select>
  );
};

export default LanguageSelector;
