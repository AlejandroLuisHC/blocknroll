import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  return (
    <select
      className="language-select"
      aria-label={t("nav.language")}
      value={i18n.resolvedLanguage ?? "es"}
      onChange={(event) => void i18n.changeLanguage(event.target.value)}
    >
      <option value="es" lang="es">Español</option>
      <option value="ca" lang="ca">Català</option>
      <option value="en" lang="en">English</option>
    </select>
  );
};

export default LanguageSelector;
