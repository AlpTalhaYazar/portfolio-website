import { describe, expect, it } from "vitest";

import { getPortfolioContent, portfolioContentByLocale } from ".";

describe("portfolio content", () => {
  it("returns the approved english hero copy", () => {
    const content = getPortfolioContent("en");

    expect(content.hero.headline).toBe(
      "I build backend systems that stay reliable under real load."
    );
    expect(content.hero.supportingText).toBe(
      "Architecture, reliability, and delivery ownership for enterprise software in production."
    );
  });

  it("keeps backend positioning and official roles aligned across locales", () => {
    const en = getPortfolioContent("en");
    const tr = getPortfolioContent("tr");

    expect(en.hero.techTags).toEqual([
      ".NET 9",
      "C#",
      "ASP.NET Core",
      "PostgreSQL",
      "RabbitMQ / MassTransit",
      "Redis",
      "Docker",
    ]);
    expect(tr.hero.techTags).toEqual(en.hero.techTags);

    expect(
      en.experience.items.map(({ company, role }) => ({ company, role }))
    ).toEqual([
      { company: "DİAS Teknoloji", role: "Software Developer" },
      { company: "Wiro AI", role: "Software Engineer" },
      { company: "Jetlink", role: "Software Engineer" },
    ]);
    expect(
      tr.experience.items.map(({ company, role }) => ({ company, role }))
    ).toEqual([
      { company: "DİAS Teknoloji", role: "Yazılım Geliştirme Uzmanı" },
      { company: "Wiro AI", role: "Software Engineer" },
      { company: "Jetlink", role: "Software Engineer" },
    ]);

    expect(en.capabilities.groups.map((group) => group.category)).toEqual([
      "Backend",
      "Data",
      "Platform",
      "Adjacent Delivery",
    ]);
    expect(tr.capabilities.groups.map((group) => group.category)).toEqual([
      "Backend",
      "Veri",
      "Platform",
      "Tamamlayıcı Yetkinlikler",
    ]);
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

  it("does not publish Kubernetes as a maintained portfolio skill", () => {
    expect(JSON.stringify(portfolioContentByLocale)).not.toMatch(/Kubernetes/i);
  });

  it("publishes six confidentiality-safe selected-work case studies", () => {
    const en = getPortfolioContent("en");
    const tr = getPortfolioContent("tr");

    expect(en.projects.items.map(({ name }) => name)).toEqual([
      "Regulated Monitoring & Management Platform",
      "Regulated Asset Tracking Platform",
      "Regulated Workflow & Verification Platform",
      "Wiro AI Infrastructure Platform",
      "Jetlink Chatbot Platform",
      "ScopePoker Real-time Estimation Platform",
    ]);
    expect(tr.projects.items.map(({ name }) => name)).toEqual([
      "Regüle İzleme ve Yönetim Platformu",
      "Regüle Varlık Takip Platformu",
      "Regüle İş Akışı ve Doğrulama Platformu",
      "Wiro AI Altyapı Platformu",
      "Jetlink Chatbot Platformu",
      "ScopePoker Gerçek Zamanlı Tahmin Platformu",
    ]);

    for (const content of [en, tr]) {
      expect(content.projects.items).toHaveLength(6);
      expect(
        content.projects.items
          .slice(0, 3)
          .every(
            (item) =>
              item.company === "DİAS Teknoloji" && Boolean(item.details?.note)
          )
      ).toBe(true);
      expect(content.projects.items[5]?.company).toMatch(/Personal|Kişisel/);
    }
  });
});
