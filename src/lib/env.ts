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
  get nodeEnv() {
    return getEnv().NODE_ENV;
  },
  get upstashRedisUrl() {
    return getEnv().UPSTASH_REDIS_REST_URL;
  },
  get upstashRedisToken() {
    return getEnv().UPSTASH_REDIS_REST_TOKEN;
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
  get fullName() {
    return getEnv().NEXT_PUBLIC_FULL_NAME;
  },
  get jobTitle() {
    return getEnv().NEXT_PUBLIC_JOB_TITLE;
  },
  get company() {
    return getEnv().NEXT_PUBLIC_COMPANY;
  },
  get contactEmail() {
    return getEnv().NEXT_PUBLIC_CONTACT_EMAIL;
  },
  get contactLocation() {
    return getEnv().NEXT_PUBLIC_CONTACT_LOCATION;
  },
  get contactPhone() {
    return getEnv().NEXT_PUBLIC_CONTACT_PHONE;
  },
  get contactPhoneWithoutSpace() {
    return getEnv().NEXT_PUBLIC_CONTACT_PHONE_WITHOUT_SPACE;
  },
  get githubUrl() {
    return getEnv().NEXT_PUBLIC_GITHUB_URL;
  },
  get linkedinUrl() {
    return getEnv().NEXT_PUBLIC_LINKEDIN_URL;
  },
  get twitterHandle() {
    return getEnv().NEXT_PUBLIC_TWITTER_HANDLE;
  },
  get gaMeasurementId() {
    return getEnv().NEXT_PUBLIC_GA_MEASUREMENT_ID;
  },
  get googleVerification() {
    return getEnv().NEXT_PUBLIC_GOOGLE_VERIFICATION;
  },
  get recaptchaSiteKey() {
    return getEnv().NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  },
};

// Utility functions
export const envUtils = {
  isDevelopment: () => serverEnv.nodeEnv === "development",
  isProduction: () => serverEnv.nodeEnv === "production",
  isTest: () => serverEnv.nodeEnv === "test",

  // Check if analytics is enabled
  isAnalyticsEnabled: () =>
    Boolean(clientEnv.gaMeasurementId) && envUtils.isProduction(),

  // Check if Redis is configured (for rate limiting)
  isRedisEnabled: () =>
    Boolean(serverEnv.upstashRedisUrl && serverEnv.upstashRedisToken),

  // Check if reCAPTCHA is enabled
  isRecaptchaEnabled: () => Boolean(clientEnv.recaptchaSiteKey),

  // Get contact info object
  getContactInfo: () => ({
    email: clientEnv.contactEmail,
    phone: clientEnv.contactPhone,
    phoneWithoutSpace: clientEnv.contactPhoneWithoutSpace,
    location: clientEnv.contactLocation,
  }),

  // Get social links
  getSocialLinks: () => ({
    github: clientEnv.githubUrl,
    linkedin: clientEnv.linkedinUrl,
    twitter: clientEnv.twitterHandle
      ? `https://twitter.com/${clientEnv.twitterHandle}`
      : undefined,
  }),

  // Get site metadata
  getSiteMetadata: () => ({
    baseUrl: clientEnv.baseUrl,
    siteUrl: clientEnv.siteUrl,
    fullName: clientEnv.fullName,
    jobTitle: clientEnv.jobTitle,
    company: clientEnv.company,
  }),
};

// Export types for use in other modules
export type { EnvConfig } from "./env-validation";
