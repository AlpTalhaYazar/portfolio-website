import { expect, test } from "@playwright/test";

import { mockCsrfToken } from "./support/mockCsrf";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await mockCsrfToken(page);
  });

  test("loads the redesigned home page", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Senior Backend Engineer/i);
    await expect(
      page.getByRole("heading", {
        name: /Alp Talha Yazar/i,
      })
    ).toBeVisible();
    await expect(
      page.getByText(/Gerçek yük altında güvenilir kalan backend sistemleri geliştiriyorum\./i)
    ).toBeVisible();
  });

  test("keeps the skip link and core sections", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".skip-link")).toBeAttached();

    for (const sectionId of [
      "#about",
      "#experience",
      "#skills",
      "#projects",
      "#contact",
    ]) {
      await expect(page.locator(sectionId)).toBeAttached();
    }
  });

  test("scrolls to the contact section from header navigation", async ({
    page,
  }) => {
    await page.goto("/");

    await page.locator('header a[href="#contact"]').first().click();
    await page.waitForTimeout(300);

    await expect(page.locator("#contact")).toBeInViewport({ ratio: 0.1 });
  });

  test("renders canonical and structured data", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.alptalha.dev/"
    );

    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toBeAttached();
    const data = JSON.parse((await jsonLd.textContent()) || "{}");
    expect(data["@context"]).toBe("https://schema.org");
  });
});
