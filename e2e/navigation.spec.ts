import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should load home page successfully", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Alp Talha Yazar/);
  });

  test("should have skip link for accessibility", async ({ page }) => {
    await page.goto("/");

    const skipLink = page.locator(".skip-link, a[href='#main-content']");
    await expect(skipLink).toBeAttached();
  });

  test("should have main sections on page", async ({ page }) => {
    await page.goto("/");

    // Check for main content sections
    const sections = [
      "#about",
      "#experience",
      "#skills",
      "#projects",
      "#contact",
    ];

    for (const sectionId of sections) {
      const section = page.locator(sectionId);
      // Section should exist (might be above or below viewport)
      await expect(section).toBeAttached();
    }
  });

  test("should scroll to section when clicking navigation link", async ({
    page,
  }) => {
    await page.goto("/");

    // Find a nav link to contact section
    const contactLink = page.locator('a[href="#contact"], a[href="/#contact"]');

    if ((await contactLink.count()) > 0) {
      await contactLink.first().click();

      // Wait for scroll
      await page.waitForTimeout(500);

      // Contact section should be in view
      const contactSection = page.locator("#contact");
      await expect(contactSection).toBeInViewport({ ratio: 0.1 });
    }
  });

  test("should have proper meta tags for SEO", async ({ page }) => {
    await page.goto("/");

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute("content", /.+/);

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /.+/);

    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /.+/);
  });

  test("should load structured data", async ({ page }) => {
    await page.goto("/");

    // Find JSON-LD script
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toBeAttached();

    // Parse and validate structure
    const content = await jsonLd.textContent();
    expect(content).toBeTruthy();

    const data = JSON.parse(content!);
    expect(data["@context"]).toBe("https://schema.org");
  });
});
