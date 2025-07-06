import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { es, en, ca } from "./locales";
import type { TypedResources } from "./types";

// Type-safe resources with strict typing
const resources: TypedResources = {
  es: { translation: es },
  en: { translation: en },
  ca: { translation: ca },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: resources as Record<
      string,
      { translation: Record<string, unknown> }
    >,
    fallbackLng: "es",
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
    },
  });

// Export types for external use
export type { TranslationSchema, TypedResources } from "./types";

export default i18n;
