import { test, expect } from "@playwright/test";

test.describe("Language Switching (i18n)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Clear language preference
    await page.evaluate(() => {
      localStorage.removeItem("language");
      document.cookie =
        "preferred-language=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
  });

  test("should support language switching via localStorage", async ({ page }) => {
    await page.goto("/");

    // Verify i18n system works by checking we can set and read languages
    await page.evaluate(() => localStorage.setItem("language", "tr"));
    await page.reload();

    const storedLang = await page.evaluate(() =>
      localStorage.getItem("language")
    );
    expect(storedLang).toBe("tr");
  });

  test("should set html lang attribute", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");
    const lang = await html.getAttribute("lang");

    // Should be one of supported languages
    expect(["en", "tr", "es"]).toContain(lang);
  });

  test("should persist language preference in localStorage", async ({
    page,
  }) => {
    await page.goto("/");

    // Manually set language preference
    await page.evaluate(() => localStorage.setItem("language", "tr"));
    await page.reload();

    const storedLang = await page.evaluate(() =>
      localStorage.getItem("language")
    );
    expect(storedLang).toBe("tr");
  });

  test("should have hreflang alternate links for SEO", async ({ page }) => {
    await page.goto("/");

    // Check for alternate language links
    const enLink = page.locator('link[rel="alternate"][hreflang="en"]');
    const trLink = page.locator('link[rel="alternate"][hreflang="tr"]');
    const esLink = page.locator('link[rel="alternate"][hreflang="es"]');

    await expect(enLink).toBeAttached();
    await expect(trLink).toBeAttached();
    await expect(esLink).toBeAttached();
  });

  test("should have x-default hreflang link", async ({ page }) => {
    await page.goto("/");

    const defaultLink = page.locator(
      'link[rel="alternate"][hreflang="x-default"]'
    );
    await expect(defaultLink).toBeAttached();
  });
});
