import { expect, test } from "@playwright/test";

import { mockCsrfToken } from "./support/mockCsrf";

test.describe("Locale routing", () => {
  test.beforeEach(async ({ page }) => {
    await mockCsrfToken(page);
  });

  test("renders english on the root route", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(
      page.getByRole("heading", {
        name: /I build backend systems that stay reliable under real load\./i,
      })
    ).toBeVisible();
  });

  test("renders turkish on /tr", async ({ page }) => {
    await page.goto("/tr");

    await expect(page.locator("html")).toHaveAttribute("lang", "tr");
    await expect(
      page.getByRole("heading", {
        name: /Gerçek yük altında güvenilir kalan backend sistemleri geliştiriyorum\./i,
      })
    ).toBeVisible();
  });

  test("does not expose spanish publicly", async ({ page }) => {
    await page.goto("/es");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(
      page.getByRole("heading", {
        name: /Route not found\./i,
      })
    ).toBeVisible();
  });

  test("exposes real hreflang alternates", async ({ page }) => {
    await page.goto("/tr");

    await expect(
      page.locator('link[rel="alternate"][hreflang="en"]')
    ).toHaveAttribute("href", "https://www.alptalha.dev/");
    await expect(
      page.locator('link[rel="alternate"][hreflang="tr"]')
    ).toHaveAttribute("href", "https://www.alptalha.dev/tr/");
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(0);
  });
});
