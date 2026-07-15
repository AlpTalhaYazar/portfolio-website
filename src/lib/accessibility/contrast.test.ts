import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

function variablesFor(selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const block = css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]+)\\}`))?.[1];
  if (!block) throw new Error(`Missing CSS variable block for ${selector}`);

  return Object.fromEntries(
    Array.from(block.matchAll(/--([\w-]+):\s*(#[\da-fA-F]{6})\s*;/g)).map(
      ([, name, value]) => [name, value]
    )
  );
}

function relativeLuminance(hex: string) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4
    );

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground: string, background: string) {
  const values = [
    relativeLuminance(foreground),
    relativeLuminance(background),
  ].sort((left, right) => right - left);

  return (values[0] + 0.05) / (values[1] + 0.05);
}

describe("portfolio color tokens", () => {
  it.each([":root", "html.light-theme"])(
    "%s normal-text tokens meet WCAG 2.2 AA on every surface",
    (selector) => {
      const tokens = variablesFor(selector);

      for (const foreground of ["muted", "faint", "placeholder", "accent"]) {
        for (const background of ["background", "surface", "surface-2"]) {
          expect(
            contrastRatio(tokens[foreground], tokens[background]),
            `${selector} --${foreground} on --${background}`
          ).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  );
});
