/**
 * Internationalization (i18n) system
 * Comprehensive multi-language support for Turkish, English, and Spanish
 */

// Configuration
export * from "./config";

// Context and hooks
export * from "./context";

// Translations
export * from "./translations";

// Re-export common types
export type { TranslationKey, TranslationPath } from "./translations";
export type { Language, LanguageConfig } from "./config";

// Main exports for easy importing
export { I18nProvider, useTranslation, useLanguage, useT } from "./context";
export { languages, defaultLanguage, supportedLanguages } from "./config";
export { translations, getTranslation } from "./translations";
