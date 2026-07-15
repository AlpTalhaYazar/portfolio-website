import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "dotenv";

export type EnvironmentMode = "development" | "production" | "test";

export interface LoadEnvironmentOptions {
  directory?: string;
  mode?: EnvironmentMode;
}

export interface LoadedEnvFile {
  path: string;
  contents: string;
  env: Record<string, string>;
}

export interface LoadEnvironmentResult {
  mode: EnvironmentMode;
  loadedEnvFiles: LoadedEnvFile[];
  combinedEnv: typeof process.env;
}

const ENVIRONMENT_MODES = new Set<EnvironmentMode>([
  "development",
  "production",
  "test",
]);

export function resolveEnvironmentMode(
  argv: string[],
  env: Readonly<Record<string, string | undefined>> = process.env
): EnvironmentMode {
  const explicitMode = argv.find((arg) => arg.startsWith("--mode="));

  if (explicitMode) {
    const mode = explicitMode.slice("--mode=".length);
    if (ENVIRONMENT_MODES.has(mode as EnvironmentMode)) {
      return mode as EnvironmentMode;
    }
  }

  if (env.NODE_ENV && ENVIRONMENT_MODES.has(env.NODE_ENV as EnvironmentMode)) {
    return env.NODE_ENV as EnvironmentMode;
  }

  return "development";
}

export function loadEnvironment({
  directory = process.cwd(),
  mode = "development",
}: LoadEnvironmentOptions = {}): LoadEnvironmentResult {
  const mutableEnv = process.env as Record<string, string | undefined>;
  const previousNodeEnv = mutableEnv.NODE_ENV;

  mutableEnv.NODE_ENV = mode;

  try {
    const fileNames = getEnvironmentFileNames(mode);
    const loadedEnvFiles: LoadedEnvFile[] = [];

    for (const fileName of fileNames) {
      const path = join(directory, fileName);
      if (!existsSync(path)) continue;

      const contents = readFileSync(path, "utf8");
      const env = parse(contents);
      loadedEnvFiles.push({ path, contents, env });

      for (const [key, value] of Object.entries(env)) {
        if (mutableEnv[key] === undefined) {
          mutableEnv[key] = value;
        }
      }
    }

    return {
      mode,
      loadedEnvFiles,
      combinedEnv: process.env,
    };
  } finally {
    if (previousNodeEnv === undefined) {
      delete mutableEnv.NODE_ENV;
    } else {
      mutableEnv.NODE_ENV = previousNodeEnv;
    }
  }
}

function getEnvironmentFileNames(mode: EnvironmentMode): string[] {
  if (mode === "production") {
    return [".env.production.local", ".env.production"];
  }

  if (mode === "test") {
    return [".env.test.local", ".env.test", ".env"];
  }

  return [".env.development.local", ".env.local", ".env.development", ".env"];
}
