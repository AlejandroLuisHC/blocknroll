import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { es, en, ca } from "./locales";

i18n.on("languageChanged", () => {
  document.documentElement.lang = i18n.resolvedLanguage ?? "es";
  document.title = i18n.t("meta.title");
});

void i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
    ca: { translation: ca },
  },
  supportedLngs: ["es", "ca", "en"],
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
