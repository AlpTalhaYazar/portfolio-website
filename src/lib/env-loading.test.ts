import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";
import { loadEnvironment, resolveEnvironmentMode } from "@/lib/env-loading";

const ORIGINAL_ENV = { ...process.env };

function createTempEnvDir(): string {
  return mkdtempSync(join(tmpdir(), "portfolio-env-loading-"));
}

function writeEnvFile(directory: string, fileName: string, content: string): void {
  writeFileSync(join(directory, fileName), content, "utf8");
}

function restoreProcessEnv(): void {
  for (const key of Object.keys(process.env)) {
    if (!(key in ORIGINAL_ENV)) {
      delete process.env[key];
    }
  }

  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    process.env[key] = value;
  }
}

describe("loadEnvironment", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    restoreProcessEnv();

    for (const directory of tempDirs.splice(0)) {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("loads development env files with .env.local before .env", () => {
    const directory = createTempEnvDir();
    tempDirs.push(directory);

    writeEnvFile(directory, ".env", "TEST_PRIORITY=from-env\n");
    writeEnvFile(directory, ".env.local", "TEST_PRIORITY=from-env-local\n");

    const result = loadEnvironment({ directory, mode: "development" });

    expect(process.env.TEST_PRIORITY).toBe("from-env-local");
    expect(result.loadedEnvFiles.map((file) => basename(file.path))).toEqual([
      ".env.local",
      ".env",
    ]);
  });

  it("loads local production plaintext before committed production env", () => {
    const directory = createTempEnvDir();
    tempDirs.push(directory);

    writeEnvFile(directory, ".env", "TEST_FALLBACK=from-env\n");
    writeEnvFile(directory, ".env.local", "TEST_PRIORITY=from-dev-local\n");
    writeEnvFile(
      directory,
      ".env.production",
      "TEST_PRIORITY=from-encrypted-production\n"
    );
    writeEnvFile(
      directory,
      ".env.production.local",
      "TEST_PRIORITY=from-production-local\n"
    );

    const result = loadEnvironment({ directory, mode: "production" });

    expect(process.env.TEST_PRIORITY).toBe("from-production-local");
    expect(process.env.TEST_FALLBACK).toBe("from-env");
    expect(result.loadedEnvFiles.map((file) => basename(file.path))).toEqual([
      ".env.production.local",
      ".env.local",
      ".env.production",
      ".env",
    ]);
  });

  it("keeps env values already injected into process.env", () => {
    const directory = createTempEnvDir();
    tempDirs.push(directory);

    process.env.TEST_PRIORITY = "from-process-env";

    writeEnvFile(
      directory,
      ".env.production",
      "TEST_PRIORITY=from-encrypted-production\n"
    );
    writeEnvFile(
      directory,
      ".env.production.local",
      "TEST_PRIORITY=from-production-local\n"
    );

    loadEnvironment({ directory, mode: "production" });

    expect(process.env.TEST_PRIORITY).toBe("from-process-env");
  });
});

describe("resolveEnvironmentMode", () => {
  it("defaults to development when no flag or env hint is provided", () => {
    expect(resolveEnvironmentMode([], {})).toBe("development");
  });

  it("uses NODE_ENV when it is set to production", () => {
    expect(resolveEnvironmentMode([], { NODE_ENV: "production" })).toBe(
      "production"
    );
  });

  it("lets the explicit --mode flag override NODE_ENV", () => {
    expect(
      resolveEnvironmentMode(["--mode=development"], {
        NODE_ENV: "production",
      })
    ).toBe("development");
  });
});
