// Locale exports with type checking to ensure all languages have the same keys
import type { TranslationSchema } from "../types";

// Import JSON files
import esTranslations from "./es.json";
import enTranslations from "./en.json";
import caTranslations from "./ca.json";

// Type-check that all language files conform to the same structure
// This will cause TypeScript errors if any keys are missing in any language
export const es: TranslationSchema = esTranslations;
export const en: TranslationSchema = enTranslations;
export const ca: TranslationSchema = caTranslations;
