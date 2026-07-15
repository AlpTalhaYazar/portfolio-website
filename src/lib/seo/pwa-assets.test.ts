import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("web app manifest", () => {
  const publicDirectory = join(process.cwd(), "public");
  const manifest = JSON.parse(
    readFileSync(join(publicDirectory, "manifest.json"), "utf8")
  ) as {
    lang: string;
    description: string;
    background_color: string;
    theme_color: string;
    icons: Array<{ src: string }>;
    shortcuts: Array<{ name: string; url: string }>;
  };

  it("matches the Turkish root experience without stale numeric claims", () => {
    expect(manifest.lang).toBe("tr");
    expect(manifest.description).not.toMatch(/\d+\+?\s*(years?|yıl)/i);
    expect(manifest.background_color).toBe("#f4f2ed");
    expect(manifest.theme_color).toBe("#f4f2ed");
    expect(manifest.shortcuts.map((shortcut) => shortcut.name)).toEqual([
      "Hakkımda",
      "Projeler",
      "İletişim",
    ]);
  });

  it("references only files that exist", () => {
    for (const icon of manifest.icons) {
      const relativePath = icon.src.replace(/^\/+/, "");
      expect(
        existsSync(join(publicDirectory, relativePath)) ||
          existsSync(join(process.cwd(), "src/app", relativePath))
      ).toBe(true);
    }

    const browserConfig = readFileSync(
      join(publicDirectory, "browserconfig.xml"),
      "utf8"
    );
    for (const [, asset] of browserConfig.matchAll(/src="\/([^\"]+)"/g)) {
      expect(existsSync(join(publicDirectory, asset))).toBe(true);
    }
  });
});
