import { loadEnvConfig } from "@next/env";

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
  const existingEnv = { ...mutableEnv };
  const previousNodeEnv = mutableEnv.NODE_ENV;

  mutableEnv.NODE_ENV = mode;

  try {
    const result = loadEnvConfig(
      directory,
      mode === "development",
      {
        info: () => undefined,
        error: () => undefined,
      },
      true
    );

    for (const [key, value] of Object.entries(existingEnv)) {
      process.env[key] = value;
    }

    return {
      mode,
      loadedEnvFiles: result.loadedEnvFiles as LoadedEnvFile[],
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
