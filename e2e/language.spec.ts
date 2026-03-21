import { expect, test } from "@playwright/test";

import { mockCsrfToken } from "./support/mockCsrf";

test.describe("Locale routing", () => {
  test.beforeEach(async ({ page }) => {
    await mockCsrfToken(page);
  });

  test("renders turkish on the root route", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "tr");
    await expect(
      page.getByRole("heading", {
        name: /Alp Talha Yazar/i,
      })
    ).toBeVisible();
    await expect(
      page.getByText(/Gerçek yük altında güvenilir kalan backend sistemleri geliştiriyorum\./i)
    ).toBeVisible();
  });

  test("renders english on /en", async ({ page }) => {
    await page.goto("/en");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(
      page.getByRole("heading", {
        name: /Alp Talha Yazar/i,
      })
    ).toBeVisible();
    await expect(
      page.getByText(/I build backend systems that stay reliable under real load\./i)
    ).toBeVisible();
  });

  test("redirects /tr to the canonical root route", async ({ page }) => {
    await page.goto("/tr");

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "tr");
  });

  test("does not expose spanish publicly", async ({ page }) => {
    await page.goto("/es");

    await expect(page.locator("html")).toHaveAttribute("lang", "tr");
    await expect(
      page.getByRole("heading", {
        name: /Rota bulunamadı\./i,
      })
    ).toBeVisible();
  });

  test("exposes real hreflang alternates", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.locator('link[rel="alternate"][hreflang="en"]')
    ).toHaveAttribute("href", "https://www.alptalha.dev/en/");
    await expect(
      page.locator('link[rel="alternate"][hreflang="tr"]')
    ).toHaveAttribute("href", "https://www.alptalha.dev/");
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(0);
  });
});
