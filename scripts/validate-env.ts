#!/usr/bin/env tsx

/**
 * Environment Variable Validation Script
 *
 * This script validates environment variables before building the application.
 * It should be run during the build process to ensure all required variables are present.
 */

import { execSync } from "child_process";
import { config } from "dotenv";
import { join } from "path";
import { fileURLToPath } from "url";

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
} as const;

function colorize(color: keyof typeof colors, text: string): string {
  return `${colors[color]}${text}${colors.reset}`;
}

function logSection(title: string): void {
  console.log(`\n${colorize("cyan", "=".repeat(60))}`);
  console.log(colorize("cyan", `🔧 ${title}`));
  console.log(colorize("cyan", "=".repeat(60)));
}

async function main(): Promise<void> {
  console.log(
    colorize("blue", "\n🚀 Starting Environment Variable Validation...")
  );

  try {
    logSection("Checking TypeScript Compilation");

    // First, compile the TypeScript validation module
    console.log("📦 Compiling TypeScript validation module...");
    execSync("npx tsc --noEmit --skipLibCheck src/lib/env-validation.ts", {
      stdio: "pipe",
      cwd: process.cwd(),
    });
    console.log(colorize("green", "✅ TypeScript compilation successful"));

    logSection("Loading Environment Variables");

    // Load environment variables
    console.log("📂 Loading environment variables...");
    config({ path: join(process.cwd(), ".env.local") });
    config({ path: join(process.cwd(), ".env") });
    console.log(colorize("green", "✅ Environment files loaded"));

    logSection("Running Environment Validation");

    // Import and run validation
    console.log("🔍 Validating environment variables...");
    const { validateEnvironmentVariables, printValidationResults } =
      await import("../src/lib/env-validation");

    const result = validateEnvironmentVariables();
    printValidationResults(result);

    if (!result.isValid) {
      process.exit(1);
    }

    logSection("Validation Summary");
    console.log(
      colorize("green", "🎉 All environment variables are properly configured!")
    );
    console.log(colorize("green", "✅ Build can proceed safely."));
  } catch (error) {
    logSection("Validation Failed");
    console.error(colorize("red", "💥 Environment validation failed!"));

    const execError = error as { stdout?: Buffer; stderr?: Buffer };
    if (execError.stdout) {
      console.error(execError.stdout.toString());
    }
    if (execError.stderr) {
      console.error(execError.stderr.toString());
    }

    console.error(colorize("yellow", "\n💡 Quick Setup Guide:"));
    console.error(colorize("yellow", "1. Copy .env.example to .env.local"));
    console.error(
      colorize("yellow", "2. Fill in all required environment variables")
    );
    console.error(
      colorize("yellow", "3. Run this validation again: npm run validate:env")
    );
    console.error(
      colorize("yellow", "4. See CONTACT_SETUP.md for Gmail configuration help")
    );

    process.exit(1);
  }
}

// Run the validation if this script is executed directly
// Use import.meta.main if available (Node.js v20.6.0+), otherwise fallback to filename check
const scriptFilename = fileURLToPath(import.meta.url);
const isMain =
  typeof import.meta.main === "boolean"
    ? import.meta.main
    : process.argv[1] &&
      process.argv[1].endsWith(scriptFilename.split(/[\\/]/).pop() || "");

if (isMain) {
  main().catch((error) => {
    console.error(
      colorize("red", "Unexpected error during validation:"),
      error
    );
    process.exit(1);
  });
}

export { main };
