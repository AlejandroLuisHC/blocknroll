import type es from "./locales/es.json";

export type TranslationSchema = typeof es;

export interface TypedResources {
  es: { translation: TranslationSchema };
  en: { translation: TranslationSchema };
  ca: { translation: TranslationSchema };
}
