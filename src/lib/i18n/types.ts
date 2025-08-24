/**
 * Advanced TypeScript utilities for type-safe translations
 */

import type { TranslationKey } from "./translations/en";

// Create a type for all possible translation paths
type PathsToStringProps<T> = T extends string | readonly string[]
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T extends readonly string[], D extends string> = T extends readonly [
  infer F,
  ...infer R
]
  ? F extends string
    ? string extends F
      ? string
      : R extends readonly string[]
      ? `${F}${D}${Join<R, D>}`
      : F
    : never
  : "";

// Type for all valid translation paths
export type TranslationPath = Join<PathsToStringProps<TranslationKey>, ".">;

// Type to get the value at a given path
export type PathValue<
  T,
  P extends string
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never;

// Helper type to get the return type for a specific path
export type TranslationReturnType<P extends TranslationPath> = PathValue<
  TranslationKey,
  P
>;

// Specific typed paths for arrays
export type TranslationArrayPath = {
  [K in TranslationPath]: TranslationReturnType<K> extends readonly string[]
    ? K
    : never;
}[TranslationPath];

// Specific typed paths for strings
export type TranslationStringPath = {
  [K in TranslationPath]: TranslationReturnType<K> extends string ? K : never;
}[TranslationPath];
