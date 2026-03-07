import { describe, expect, it } from "vitest";

import { getPortfolioContent } from ".";

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

  it("returns translated content for spanish routes", () => {
    const content = getPortfolioContent("es");

    expect(content.nav.items[1].label).toBe("Experiencia");
    expect(content.notFound.title).toBe("Ruta no encontrada.");
  });
});
