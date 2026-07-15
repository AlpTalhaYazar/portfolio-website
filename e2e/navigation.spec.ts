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

    let contactLink = page.locator('header a[href="#contact"]:visible').first();

    if (!(await contactLink.isVisible())) {
      await page
        .getByRole("button", { name: /navigasyonu aç|open navigation/i })
        .click();
      contactLink = page
        .getByRole("dialog")
        .locator('a[href="#contact"]')
        .first();
    }

    await contactLink.click();
    await page.waitForTimeout(300);

    await expect(page.locator("#contact")).toBeInViewport({ ratio: 0.1 });
  });

  test("mobile navigation contains focus and closes with Escape", async ({
    page,
  }, testInfo) => {
    test.skip(!testInfo.project.name.includes("mobile"), "mobile project only");
    await page.goto("/en");

    const trigger = page.getByRole("button", { name: "Open navigation" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Mobile navigation" });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "Close navigation" })
    ).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
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
