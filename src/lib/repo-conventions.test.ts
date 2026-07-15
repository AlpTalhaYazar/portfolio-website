import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
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
    ) as {
      packageManager?: string;
      engines?: { node?: string; npm?: string };
      scripts?: { [name: string]: string };
      overrides?: Record<string, unknown>;
    };
    const nodeVersion = readFileSync(join(repoRoot, ".nvmrc"), "utf8").trim();
    const ciWorkflow = readFileSync(
      join(repoRoot, ".github/workflows/ci.yml"),
      "utf8"
    );

    expect(packageJson.packageManager).toBe("npm@12.0.1");
    expect(packageJson.engines).toEqual({
      node: ">=24.15.0 <25",
      npm: ">=12.0.1 <13",
    });
    expect(nodeVersion).toBe("24");
    expect(ciWorkflow).toContain("npm install --global npm@12.0.1");
    expect(packageJson.scripts?.["audit:dependencies"]).toBe(
      "npm audit --audit-level=high && npm audit --omit=dev --audit-level=moderate"
    );
    expect(ciWorkflow).toContain("npm run audit:dependencies");
    expect(packageJson.overrides).toEqual({
      postcss: "8.5.19",
      "minimatch@3.1.5": { "brace-expansion": "1.1.13" },
      "flat-cache": { flatted: "3.4.2" },
      "webpack-bundle-analyzer": { ws: "7.5.12" },
    });
    expect(existsSync(join(repoRoot, "package-lock.json"))).toBe(true);
    expect(existsSync(join(repoRoot, "pnpm-lock.yaml"))).toBe(false);
  });

  it("keeps tracked project files non-executable and private from group writes", () => {
    const trackedFiles = execFileSync("git", ["ls-files", "-z"], {
      cwd: repoRoot,
      encoding: "utf8",
    })
      .split("\0")
      .filter(Boolean);

    const unsafeModes = trackedFiles.flatMap((relativePath) => {
      const absolutePath = join(repoRoot, relativePath);
      if (!existsSync(absolutePath)) return [];

      const mode = statSync(absolutePath).mode & 0o777;
      const hasExecutableBit = (mode & 0o111) !== 0;
      const isGroupOrWorldWritable = (mode & 0o022) !== 0;

      return hasExecutableBit || isGroupOrWorldWritable
        ? [`${relativePath}:${mode.toString(8)}`]
        : [];
    });

    expect(unsafeModes).toEqual([]);
  });

  it("keeps the maintained portfolio as the only UI implementation", () => {
    const removedLegacyDirectories = [
      "src/components/layout",
      "src/components/pages",
      "src/components/theme",
      "src/components/ui",
    ];
    const removedLegacyFiles = [
      "src/lib/data.ts",
      "src/lib/performance.ts",
      "src/lib/theme-script.ts",
      "src/lib/security-edge.ts",
      "src/lib/security-shared.ts",
    ];

    const remainingDirectoryFiles = removedLegacyDirectories.flatMap(
      (relativePath) => {
        const absolutePath = join(repoRoot, relativePath);
        return existsSync(absolutePath)
          ? readdirSync(absolutePath, { recursive: true }).map(String)
          : [];
      }
    );

    expect(remainingDirectoryFiles).toEqual([]);
    expect(
      removedLegacyFiles.filter((relativePath) =>
        existsSync(join(repoRoot, relativePath))
      )
    ).toEqual([]);
  });

  it("keeps API cross-origin policy in route code instead of static platform headers", () => {
    const vercelConfig = JSON.parse(
      readFileSync(join(repoRoot, "vercel.json"), "utf8")
    ) as { headers?: unknown[] };

    expect(vercelConfig.headers).toBeUndefined();
  });
});
