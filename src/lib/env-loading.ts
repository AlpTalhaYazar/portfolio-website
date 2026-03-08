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

export function loadEnvironment({
  directory = process.cwd(),
  mode = "development",
}: LoadEnvironmentOptions = {}): LoadEnvironmentResult {
  const existingEnv = { ...process.env };
  const previousNodeEnv = process.env.NODE_ENV;

  process.env.NODE_ENV = mode;

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
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnv;
    }
  }
}
