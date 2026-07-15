import { describe, expect, it } from "vitest";
import { validateEnvironmentVariables } from "@/lib/env-validation";

const validEnvironment = {
  GMAIL_USER: "owner@example.com",
  GMAIL_APP_PASSWORD: "a-secure-app-password",
  EMAIL_TO: "owner@example.com",
  NODE_ENV: "production",
  NEXT_PUBLIC_BASE_URL: "https://example.com",
  NEXT_PUBLIC_SITE_URL: "https://example.com",
  NEXT_PUBLIC_FULL_NAME: "Portfolio Owner",
  NEXT_PUBLIC_CONTACT_EMAIL: "owner@example.com",
  NEXT_PUBLIC_CONTACT_LOCATION: "Istanbul, Türkiye",
  NEXT_PUBLIC_GITHUB_URL: "https://github.com/example",
  NEXT_PUBLIC_LINKEDIN_URL: "https://linkedin.com/in/example",
  CSRF_SECRET: "a".repeat(32),
};

describe("validateEnvironmentVariables", () => {
  it("accepts a complete production environment", () => {
    const result = validateEnvironmentVariables(validEnvironment);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("requires a strong CSRF secret in production", () => {
    const result = validateEnvironmentVariables({
      ...validEnvironment,
      CSRF_SECRET: "too-short",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ variable: "CSRF_SECRET" }),
      ])
    );
  });

  it("allows the development-only CSRF fallback outside production", () => {
    const { CSRF_SECRET: _csrfSecret, ...environment } = validEnvironment;

    const result = validateEnvironmentVariables({
      ...environment,
      NODE_ENV: "development",
    });

    expect(result.isValid).toBe(true);
  });

  it("rejects a partially configured Redis integration", () => {
    const result = validateEnvironmentVariables({
      ...validEnvironment,
      UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ variable: "UPSTASH_REDIS_REST_TOKEN" }),
      ])
    );
  });
});
