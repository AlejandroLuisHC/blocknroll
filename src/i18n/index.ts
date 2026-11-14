import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { es, en, ca } from "./locales";
import { applyDocumentMetadata, languageFromPath } from "../seo/site";

i18n.on("languageChanged", () => {
  const language = i18n.resolvedLanguage;
  if (language === "es" || language === "ca" || language === "en") applyDocumentMetadata(language);
});

void i18n.use(LanguageDetector).use(initReactI18next).init({
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
  detection: {
    order: ["localStorage", "navigator", "htmlTag"],
    caches: ["localStorage"],
  },
});

export type { TranslationSchema, TypedResources } from "./types";
export default i18n;
