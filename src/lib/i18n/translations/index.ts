/**
 * Translation system index
 * Exports all translations and provides type-safe access
 */

import en from "./en";
import tr from "./tr";
import es from "./es";
import type { Language } from "../config";
import type { TranslationKey } from "./en";

// All translations object
export const translations = {
  en,
  tr,
  es,
} as const;

// Type for translation keys (based on English as reference)
export type { TranslationKey };

// Simplified type for translation paths (string literal)
export type TranslationPath = string;

// Translation path type export

/**
 * Internal function that accepts any string path
 */
function getTranslationInternal(language: Language, path: string): unknown {
  const translation = translations[language];

  const keys = path.split(".");
  let result: unknown = translation;

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      // Fallback to English if path not found
      const fallback = translations.en;
      let fallbackResult: unknown = fallback;

      for (const fallbackKey of keys) {
        if (
          fallbackResult &&
          typeof fallbackResult === "object" &&
          fallbackKey in fallbackResult
        ) {
          fallbackResult = (fallbackResult as Record<string, unknown>)[
            fallbackKey
          ];
        } else {
          // Return path as fallback if nothing found
          console.warn(
            `Translation not found for path: ${path} in language: ${language}`
          );
          return path;
        }
      }

      return fallbackResult;
    }
  }

  return result;
}

/**
 * Get translation by path with full type safety
 */
export function getTranslation<P extends import("../types").TranslationPath>(
  language: Language,
  path: P
): import("../types").TranslationReturnType<P> {
  return getTranslationInternal(
    language,
    path
  ) as import("../types").TranslationReturnType<P>;
}

/**
 * Export internal function for proxy usage
 */
export { getTranslationInternal };

/**
 * Check if translation exists for a given path
 */
export function hasTranslation(language: Language, path: string): boolean {
  const translation = translations[language];
  const keys = path.split(".");
  let result: unknown = translation;

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return false;
    }
  }

  return result !== undefined;
}

/**
 * Get all available translation keys for debugging
 */
export function getTranslationKeys(
  prefix = "",
  obj: Record<string, unknown> = translations.en
): string[] {
  const keys: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      keys.push(
        ...getTranslationKeys(currentPath, value as Record<string, unknown>)
      );
    } else {
      keys.push(currentPath);
    }
  }

  return keys;
}

/**
 * Validate that all language translations have the same structure
 */
export function validateTranslations(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const englishKeys = getTranslationKeys();

  for (const [lang, translation] of Object.entries(translations)) {
    if (lang === "en") continue;

    const langKeys = getTranslationKeys("", translation);

    // Check for missing keys
    const missingKeys = englishKeys.filter((key) => !langKeys.includes(key));
    if (missingKeys.length > 0) {
      errors.push(`${lang}: Missing keys: ${missingKeys.join(", ")}`);
    }

    // Check for extra keys
    const extraKeys = langKeys.filter((key) => !englishKeys.includes(key));
    if (extraKeys.length > 0) {
      errors.push(`${lang}: Extra keys: ${extraKeys.join(", ")}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Export individual translations
export { en, tr, es };

// Export types
export type { Language };

// Default export for convenience
export default translations;
