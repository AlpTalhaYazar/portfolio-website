/**
 * Centralized Environment Variable Access
 *
 * This module provides type-safe access to environment variables throughout the application.
 * All environment variable access should go through this module to ensure validation.
 */

import { getValidatedEnv, type EnvConfig } from "./env-validation";

// Cache the validated environment variables
let cachedEnv: EnvConfig | null = null;

/**
 * Get validated environment variables
 * This function caches the result to avoid re-validation on every call
 */
export function getEnv(): EnvConfig {
  if (cachedEnv === null) {
    cachedEnv = getValidatedEnv();
  }
  return cachedEnv;
}

/**
 * Type-safe environment variable getters
 * Use these instead of direct process.env access
 */

// Server-side environment variables
export const serverEnv = {
  get gmailUser() {
    return getEnv().GMAIL_USER;
  },
  get gmailAppPassword() {
    return getEnv().GMAIL_APP_PASSWORD;
  },
  get emailTo() {
    return getEnv().EMAIL_TO || getEnv().GMAIL_USER;
  },
};

// Client-side environment variables
export const clientEnv = {
  get baseUrl() {
    return getEnv().NEXT_PUBLIC_BASE_URL;
  },
  get siteUrl() {
    return getEnv().NEXT_PUBLIC_SITE_URL;
  },
};

// Export types for use in other modules
export type { EnvConfig } from "./env-validation";
