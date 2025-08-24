/**
 * Proxy-based translation system for dot notation access
 * Allows accessing translations like: t.about.title instead of t("about.title")
 */

import type { TranslationKey } from "./translations/en";
import type { Language } from "./config";
import { getTranslationInternal } from "./translations";

// Create a deep proxy type that mirrors the translation structure
type DeepProxy<T> = {
  readonly [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly string[]
    ? readonly string[]
    : T[K] extends object
    ? DeepProxy<T[K]>
    : T[K];
};

// Type for the proxied translation object
export type TranslationProxy = DeepProxy<TranslationKey>;

/**
 * Create a proxied translation object that supports dot notation access
 */
export function createTranslationProxy(
  language: Language,
  path: string = ""
): TranslationProxy {
  // Create a base object that contains the actual translation structure
  const baseObject = {} as TranslationProxy;

  return new Proxy(baseObject, {
    get(target, prop: string | symbol) {
      if (typeof prop === "symbol") {
        return undefined;
      }

      const currentPath = path ? `${path}.${prop}` : prop;

      try {
        // Try to get the translation value
        const value = getTranslationInternal(language, currentPath);

        // If the value is undefined or null, we might be accessing a nested object
        if (value === undefined || value === null) {
          // Check if this path exists in the translation structure
          // by trying to access a common nested property
          const testPath = `${currentPath}.title`;
          const testValue = getTranslationInternal(language, testPath);

          if (testValue !== undefined && testValue !== null) {
            // This is likely a nested object, return a new proxy
            return createTranslationProxy(language, currentPath);
          }

          // Return the currentPath as fallback
          return currentPath;
        }

        // If it's a primitive value (string or array), return it
        if (typeof value === "string" || Array.isArray(value)) {
          return value;
        }

        // If it's an object, return a new proxy for deeper navigation
        if (typeof value === "object" && value !== null) {
          return createTranslationProxy(language, currentPath);
        }

        // Fallback: return the currentPath
        return currentPath;
      } catch (error) {
        console.warn(
          `Translation proxy error for path "${currentPath}":`,
          error
        );
        // Fallback to string path
        return currentPath;
      }
    },

    // Enable enumeration for debugging
    ownKeys() {
      return [];
    },

    has() {
      return true;
    },

    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true,
      };
    },
  });
}

/**
 * Type guard to check if a value is a translation proxy
 */
export function isTranslationProxy(value: unknown): value is TranslationProxy {
  return typeof value === "object" && value !== null;
}

/**
 * Helper to convert proxy path to string for debugging
 */
export function getProxyPath(_proxy: TranslationProxy): string {
  // This is a bit tricky to implement without storing state
  // For now, we'll just return a placeholder
  return "[TranslationProxy]";
}
