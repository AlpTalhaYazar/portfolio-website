import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { syncProductionEnv } from "./sync-production-env";

function createTempRepo(): string {
  return mkdtempSync(join(tmpdir(), "portfolio-sync-production-env-"));
}

describe("syncProductionEnv", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    vi.restoreAllMocks();

    for (const directory of tempDirs.splice(0)) {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("fails fast when .env.keys is missing", () => {
    const repoRoot = createTempRepo();
    tempDirs.push(repoRoot);

    mkdirSync(join(repoRoot, "node_modules", ".bin"), { recursive: true });
    writeFileSync(join(repoRoot, "node_modules", ".bin", "dotenvx"), "", "utf8");
    writeFileSync(join(repoRoot, ".env.production.local"), "SECRET=value\n", "utf8");

    expect(() => syncProductionEnv({ repoRoot })).toThrow(
      "Missing .env.keys. Keep the private decryption keys locally before syncing the encrypted production file."
    );
  });

  it("encrypts from a temp file and keeps secret values out of argv", () => {
    const repoRoot = createTempRepo();
    tempDirs.push(repoRoot);

    mkdirSync(join(repoRoot, "node_modules", ".bin"), { recursive: true });
    writeFileSync(join(repoRoot, "node_modules", ".bin", "dotenvx"), "", "utf8");
    writeFileSync(join(repoRoot, ".env.production.local"), "SECRET=value\n", "utf8");
    writeFileSync(join(repoRoot, ".env.keys"), "DOTENV_PRIVATE_KEY_PRODUCTION=secret\n", "utf8");
    writeFileSync(join(repoRoot, ".env.production"), "old-content\n", "utf8");

    const execFileSync = vi.fn<(...args: unknown[]) => string>(
      () => "encrypted-output\n"
    );

    syncProductionEnv({
      repoRoot,
      execFileSync,
    });

    expect(execFileSync).toHaveBeenCalledTimes(1);

    const args = execFileSync.mock.calls[0]?.[1] as string[];
    expect(args).toContain("encrypt");
    expect(args).toContain("--stdout");
    expect(args).not.toContain("value");
    expect(args).not.toContain("SECRET=value");
    expect(readFileSync(join(repoRoot, ".env.production"), "utf8")).toBe(
      "encrypted-output\n"
    );
  });
});
