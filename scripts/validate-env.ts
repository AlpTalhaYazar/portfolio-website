#!/usr/bin/env tsx

/**
 * Environment Variable Validation Script
 *
 * This script validates environment variables before building the application.
 * It should be run during the build process to ensure all required variables are present.
 */

import { execSync } from "child_process";
import { relative } from "path";
import { fileURLToPath } from "url";
import {
  loadEnvironment,
  resolveEnvironmentMode,
  type EnvironmentMode,
} from "../src/lib/env-loading";

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

function formatLoadedFiles(mode: EnvironmentMode, loadedEnvFiles: { path: string }[]): string {
  if (loadedEnvFiles.length === 0) {
    return `No env files were loaded for ${mode} mode. Using values already present in process.env.`;
  }

  return loadedEnvFiles
    .map((file) => `- ${relative(process.cwd(), file.path)}`)
    .join("\n");
}

export async function withNodeEnv<T>(
  mode: EnvironmentMode,
  operation: () => Promise<T> | T
): Promise<T> {
  const mutableEnv = process.env as Record<string, string | undefined>;
  const previousNodeEnv = mutableEnv.NODE_ENV;
  mutableEnv.NODE_ENV = mode;

  try {
    return await operation();
  } finally {
    if (previousNodeEnv === undefined) {
      delete mutableEnv.NODE_ENV;
    } else {
      mutableEnv.NODE_ENV = previousNodeEnv;
    }
  }
}

async function main(argv = process.argv.slice(2)): Promise<void> {
  const mode = resolveEnvironmentMode(argv);

  console.log(
    colorize("blue", "\n🚀 Starting Environment Variable Validation...")
  );
  console.log(colorize("blue", `🧭 Validation mode: ${mode}`));

  try {
    logSection("Checking TypeScript Compilation");

    // First, compile the TypeScript validation module
    console.log("📦 Compiling TypeScript validation module...");
    execSync(
      "npx tsc --noEmit --skipLibCheck src/lib/env-validation.ts src/lib/env-loading.ts",
      {
        stdio: "pipe",
        cwd: process.cwd(),
      }
    );
    console.log(colorize("green", "✅ TypeScript compilation successful"));

    logSection("Loading Environment Variables");

    // Load environment variables using the same precedence as the app workflow.
    console.log("📂 Loading environment variables...");
    const loadResult = loadEnvironment({ mode });
    console.log(formatLoadedFiles(mode, loadResult.loadedEnvFiles));
    console.log(colorize("green", "✅ Environment loading complete"));

    logSection("Running Environment Validation");

    // Import and run validation
    const result = await withNodeEnv(mode, async () => {
      console.log("🔍 Validating environment variables...");
      const { validateEnvironmentVariables, printValidationResults } =
        await import("../src/lib/env-validation");

      const validationResult = validateEnvironmentVariables();
      printValidationResults(validationResult);

      return validationResult;
    });

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
    if (mode === "production") {
      console.error(
        colorize(
          "yellow",
          "1. Store plaintext production values only in .env.production.local for local verification"
        )
      );
      console.error(
        colorize(
          "yellow",
          "2. Or preload the encrypted repo file with dotenvx run --env-file=.env.production -- npm run validate:env:production"
        )
      );
      console.error(
        colorize(
          "yellow",
          "3. Keep DOTENV_PRIVATE_KEY_PRODUCTION outside git and inject it via your runtime or deployment platform"
        )
      );
    } else {
      console.error(colorize("yellow", "1. Copy .env.example to .env.local"));
      console.error(
        colorize("yellow", "2. Fill in all required environment variables")
      );
      console.error(
        colorize("yellow", "3. Run this validation again: npm run validate:env")
      );
    }
    console.error(
      colorize("yellow", "4. See CONTACT_SETUP.md for Gmail configuration help")
    );

    process.exit(1);
  }
}

function isExecutedDirectly(): boolean {
  const currentFile = fileURLToPath(import.meta.url);
  return process.argv[1] === currentFile;
}

if (isExecutedDirectly()) {
  main().catch((error) => {
    console.error(
      colorize("red", "Unexpected error during validation:"),
      error
    );
    process.exit(1);
  });
}

export { main };
