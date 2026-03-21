import { describe, expect, it } from "vitest";

import sitemap from "./sitemap";

describe("sitemap", () => {
  it("uses trailing slashes that match canonical portfolio routes", () => {
    expect(sitemap()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "https://www.alptalha.dev/",
        }),
        expect.objectContaining({
          url: "https://www.alptalha.dev/en/",
        }),
      ])
    );
  });
});
