/**
 * Internationalization Configuration
 * Supports Turkish (tr), English (en), and Spanish (es)
 */

export const languages = {
  en: {
    code: "en",
    name: "English",
    flag: "🇺🇸",
    dir: "ltr",
  },
  tr: {
    code: "tr",
    name: "Türkçe",
    flag: "🇹🇷",
    dir: "ltr",
  },
  es: {
    code: "es",
    name: "Español",
    flag: "🇪🇸",
    dir: "ltr",
  },
} as const;

export type Language = keyof typeof languages;
export type LanguageConfig = (typeof languages)[Language];

export const defaultLanguage: Language = "en";
export const supportedLanguages: Language[] = Object.keys(
  languages
) as Language[];

export const i18nConfig = {
  defaultLanguage,
  supportedLanguages,
  languages,
  cookieName: "NEXT_LOCALE",
  storageKey: "preferred-language",
  fallbackLanguage: "en",
} as const;

/**
 * Get language from various sources with fallback
 */
export function getLanguageFromSources(): Language {
  if (typeof window === "undefined") return defaultLanguage;

  // Check localStorage first
  const stored = localStorage.getItem(i18nConfig.storageKey);
  if (stored && supportedLanguages.includes(stored as Language)) {
    return stored as Language;
  }

  // Check browser language
  const browserLang = navigator.language.slice(0, 2) as Language;
  if (supportedLanguages.includes(browserLang)) {
    return browserLang;
  }

  return defaultLanguage;
}

/**
 * Save language preference
 */
export function saveLanguagePreference(language: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(i18nConfig.storageKey, language);
}

/**
 * Type-safe language checker
 */
export function isValidLanguage(lang: string): lang is Language {
  return supportedLanguages.includes(lang as Language);
}
