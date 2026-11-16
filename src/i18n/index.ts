import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { es, en, ca } from "./locales";
import { applyDocumentMetadata, languageFromPath, pageFromPath } from "../seo/site";

i18n.on("languageChanged", () => {
  const language = i18n.resolvedLanguage;
  if (language === "es" || language === "ca" || language === "en") {
    applyDocumentMetadata(language, pageFromPath(window.location.pathname) ?? "home");
  }
});

void i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
    ca: { translation: ca },
  },
  supportedLngs: ["es", "ca", "en"],
  lng: languageFromPath(window.location.pathname) ?? "es",
  load: "languageOnly",
  fallbackLng: "es",
  interpolation: { escapeValue: false },
});

export type { TranslationSchema, TypedResources } from "./types";
export default i18n;
