import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();

describe("repo conventions", () => {
  it("uses Next.js proxy convention instead of the deprecated middleware file", async () => {
    expect(existsSync(join(repoRoot, "src/proxy.ts"))).toBe(true);
    expect(existsSync(join(repoRoot, "src/middleware.ts"))).toBe(false);

    const proxyModule = await import("@/proxy");

    expect(typeof proxyModule.proxy).toBe("function");
    expect(proxyModule.config).toBeDefined();
  });

  it("declares npm as the package manager and keeps a single committed lock file", () => {
    const packageJson = JSON.parse(
      readFileSync(join(repoRoot, "package.json"), "utf8")
    ) as { packageManager?: string };

    expect(packageJson.packageManager).toMatch(/^npm@\d+\.\d+\.\d+$/);
    expect(existsSync(join(repoRoot, "package-lock.json"))).toBe(true);
    expect(existsSync(join(repoRoot, "pnpm-lock.yaml"))).toBe(false);
  });
});
