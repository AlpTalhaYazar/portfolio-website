/**
 * Environment Variable Validation System
 *
 * This module validates all required environment variables at build time
 * and provides type-safe access to environment variables throughout the application.
 */

import { z } from "zod";

// Define validation schemas for different types of environment variables
const emailSchema = z.string().email("Invalid email format");
const urlSchema = z.string().url("Invalid URL format");
const nonEmptyStringSchema = z.string().min(1, "Cannot be empty");
const optionalStringSchema = z.string().optional();
const phoneSchema = z
  .string()
  .regex(/^[\+]?[1-9][\d\s\-\(\)]{0,20}$/, "Invalid phone number format");

// Server-side environment variables schema
const serverEnvSchema = z.object({
  // Required Gmail Configuration
  GMAIL_USER: emailSchema,
  GMAIL_APP_PASSWORD: z
    .string()
    .min(16, "Gmail App Password must be at least 16 characters"),

  // Optional Email Configuration
  EMAIL_TO: emailSchema.optional(),

  // System Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

// Client-side environment variables schema (NEXT_PUBLIC_*)
const clientEnvSchema = z.object({
  // Required Site Configuration
  NEXT_PUBLIC_BASE_URL: urlSchema,
  NEXT_PUBLIC_SITE_URL: urlSchema,

  // Required Personal Information
  NEXT_PUBLIC_FULL_NAME: nonEmptyStringSchema,
  NEXT_PUBLIC_JOB_TITLE: nonEmptyStringSchema,
  NEXT_PUBLIC_COMPANY: nonEmptyStringSchema,

  // Required Contact Information
  NEXT_PUBLIC_CONTACT_EMAIL: emailSchema,
  NEXT_PUBLIC_CONTACT_LOCATION: nonEmptyStringSchema,
  NEXT_PUBLIC_CONTACT_PHONE: nonEmptyStringSchema,
  NEXT_PUBLIC_CONTACT_PHONE_WITHOUT_SPACE: phoneSchema,

  // Required Social Media Links
  NEXT_PUBLIC_GITHUB_URL: urlSchema,
  NEXT_PUBLIC_LINKEDIN_URL: urlSchema,

  // Optional Social Media
  NEXT_PUBLIC_TWITTER_HANDLE: optionalStringSchema,

  // Optional Analytics & Verification
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z
    .string()
    .regex(
      /^G-[A-Z0-9]+$/,
      "Invalid Google Analytics Measurement ID format (should start with G-)"
    )
    .optional(),
  NEXT_PUBLIC_GOOGLE_VERIFICATION: optionalStringSchema,

  // Optional Security (Future Implementation)
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: optionalStringSchema,
});

// Optional server-side variables (for future features)
const optionalServerEnvSchema = z.object({
  UPSTASH_REDIS_REST_URL: urlSchema.optional(),
  UPSTASH_REDIS_REST_TOKEN: optionalStringSchema,
});

// Combined schema
const envSchema = serverEnvSchema
  .merge(clientEnvSchema)
  .merge(optionalServerEnvSchema);

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validation results interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    variable: string;
    message: string;
    category: "required" | "format" | "missing";
  }>;
  warnings: Array<{
    variable: string;
    message: string;
  }>;
}

/**
 * Environment variable categories for better error reporting
 */
const ENV_CATEGORIES = {
  GMAIL_USER: "Gmail SMTP Configuration",
  GMAIL_APP_PASSWORD: "Gmail SMTP Configuration",
  EMAIL_TO: "Email Configuration",
  NEXT_PUBLIC_BASE_URL: "Site Configuration",
  NEXT_PUBLIC_SITE_URL: "Site Configuration",
  NEXT_PUBLIC_FULL_NAME: "Personal Information",
  NEXT_PUBLIC_JOB_TITLE: "Personal Information",
  NEXT_PUBLIC_COMPANY: "Personal Information",
  NEXT_PUBLIC_CONTACT_EMAIL: "Contact Information",
  NEXT_PUBLIC_CONTACT_LOCATION: "Contact Information",
  NEXT_PUBLIC_CONTACT_PHONE: "Contact Information",
  NEXT_PUBLIC_CONTACT_PHONE_WITHOUT_SPACE: "Contact Information",
  NEXT_PUBLIC_GITHUB_URL: "Social Media Links",
  NEXT_PUBLIC_LINKEDIN_URL: "Social Media Links",
  NEXT_PUBLIC_TWITTER_HANDLE: "Social Media (Optional)",
  NEXT_PUBLIC_GA_MEASUREMENT_ID: "Analytics & Verification",
  NEXT_PUBLIC_GOOGLE_VERIFICATION: "Analytics & Verification",
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "Security (Optional)",
  UPSTASH_REDIS_REST_URL: "Security (Optional)",
  UPSTASH_REDIS_REST_TOKEN: "Security (Optional)",
} as const;

/**
 * Validates environment variables and returns detailed results
 */
export function validateEnvironmentVariables(): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  try {
    // Validate the environment variables
    const validatedEnv = envSchema.parse(process.env);

    // Check for potential issues and add warnings
    addWarnings(result, validatedEnv);
  } catch (error) {
    result.isValid = false;

    if (error instanceof z.ZodError) {
      // Process Zod validation errors
      for (const issue of error.issues) {
        const variable = issue.path[0] as string;
        const category =
          ENV_CATEGORIES[variable as keyof typeof ENV_CATEGORIES];

        // Determine error type
        let errorCategory: "required" | "format" | "missing" = "format";
        if (
          issue.code === z.ZodIssueCode.invalid_type &&
          "received" in issue &&
          issue.received === "undefined"
        ) {
          errorCategory = "missing";
        } else if (
          issue.message.includes("Cannot be empty") ||
          issue.message.includes("Invalid")
        ) {
          errorCategory = "format";
        }

        result.errors.push({
          variable,
          message: `[${category}] ${issue.message}`,
          category: errorCategory,
        });
      }
    } else {
      // Handle unexpected errors
      result.errors.push({
        variable: "UNKNOWN",
        message: `Unexpected validation error: ${error}`,
        category: "required",
      });
    }
  }

  return result;
}

/**
 * Add warnings for potential configuration issues
 */
function addWarnings(result: ValidationResult, validatedEnv: EnvConfig): void {
  // Check if development URLs are used in production
  if (validatedEnv.NODE_ENV === "production") {
    const baseUrl = validatedEnv.NEXT_PUBLIC_BASE_URL;
    const siteUrl = validatedEnv.NEXT_PUBLIC_SITE_URL;

    if (baseUrl?.includes("localhost") || baseUrl?.includes("127.0.0.1")) {
      result.warnings.push({
        variable: "NEXT_PUBLIC_BASE_URL",
        message: "Using localhost URL in production environment",
      });
    }

    if (siteUrl?.includes("localhost") || siteUrl?.includes("127.0.0.1")) {
      result.warnings.push({
        variable: "NEXT_PUBLIC_SITE_URL",
        message: "Using localhost URL in production environment",
      });
    }
  }

  // Check if EMAIL_TO is different from GMAIL_USER
  if (
    validatedEnv.EMAIL_TO &&
    validatedEnv.EMAIL_TO !== validatedEnv.GMAIL_USER
  ) {
    result.warnings.push({
      variable: "EMAIL_TO",
      message:
        "EMAIL_TO is different from GMAIL_USER - ensure the Gmail account can send to this address",
    });
  }

  // Check if Google Analytics is configured
  if (
    !validatedEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID &&
    validatedEnv.NODE_ENV === "production"
  ) {
    result.warnings.push({
      variable: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
      message: "Google Analytics not configured for production environment",
    });
  }
}

/**
 * Pretty-prints validation results to console
 */
export function printValidationResults(result: ValidationResult): void {
  if (result.isValid && result.warnings.length === 0) {
    console.log("✅ All environment variables are valid!");
    return;
  }

  if (!result.isValid) {
    console.error("\n🚨 Environment Variable Validation Failed!\n");

    // Group errors by category
    const errorsByCategory = result.errors.reduce((acc, error) => {
      const category = error.message.split("]")[0].replace("[", "");
      if (!acc[category]) acc[category] = [];
      acc[category].push(error);
      return acc;
    }, {} as Record<string, typeof result.errors>);

    Object.entries(errorsByCategory).forEach(([category, errors]) => {
      console.error(`\n📋 ${category}:`);
      errors.forEach((error) => {
        console.error(
          `   ❌ ${error.variable}: ${
            error.message.split("] ")[1] || error.message
          }`
        );
      });
    });
  }

  if (result.warnings.length > 0) {
    console.warn("\n⚠️  Environment Variable Warnings:\n");
    result.warnings.forEach((warning) => {
      console.warn(`   ⚠️  ${warning.variable}: ${warning.message}`);
    });
  }

  if (!result.isValid) {
    console.error("\n💡 To fix these issues:");
    console.error("   1. Copy .env.example to .env.local");
    console.error("   2. Fill in all required environment variables");
    console.error(
      "   3. Ensure all URLs are valid and use HTTPS in production"
    );
    console.error(
      "   4. Generate Gmail App Password at https://myaccount.google.com/apppasswords\n"
    );

    process.exit(1);
  }
}

/**
 * Get validated and typed environment variables
 * This should be used instead of direct process.env access
 */
export function getValidatedEnv(): EnvConfig {
  const result = validateEnvironmentVariables();

  if (!result.isValid) {
    printValidationResults(result);
    throw new Error("Environment validation failed");
  }

  // Print warnings if any
  if (result.warnings.length > 0) {
    printValidationResults(result);
  }

  return envSchema.parse(process.env);
}

// Export individual validation schemas for use in other modules
export { serverEnvSchema, clientEnvSchema, optionalServerEnvSchema };
