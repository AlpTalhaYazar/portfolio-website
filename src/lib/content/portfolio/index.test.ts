import { describe, expect, it } from "vitest";

import { getPortfolioContent, portfolioContentByLocale } from ".";

describe("portfolio content", () => {
  it("returns the approved english hero copy", () => {
    const content = getPortfolioContent("en");

    expect(content.hero.headline).toBe(
      "I build backend systems that stay reliable under real load."
    );
    expect(content.hero.supportingText).toBe(
      "Architecture, reliability, and scale for enterprise software in production."
    );
  });

  it("returns translated content for turkish routes", () => {
    const content = getPortfolioContent("tr");

    expect(content.nav.items[0].label).toBe("Projeler");
    expect(content.contact.headline).toBe(
      "Önemli işler üretelim."
    );
  });

  it("contains exactly the publicly maintained locales", () => {
    expect(Object.keys(portfolioContentByLocale)).toEqual(["en", "tr"]);
  });

  it("keeps summary copy free of drifting numeric experience claims", () => {
    for (const content of Object.values(portfolioContentByLocale)) {
      expect(content.about.paragraphs.join(" ")).not.toMatch(/\b\d+\+\s*(years?|yıl)/i);
      expect(content.capabilities.statLabel).not.toMatch(/\b\d+\+/);
    }
  });
});
