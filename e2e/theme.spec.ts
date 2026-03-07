import { expect, test } from "@playwright/test";

import { mockCsrfToken } from "./support/mockCsrf";

test.describe("Redesign shell", () => {
  test.beforeEach(async ({ page }) => {
    await mockCsrfToken(page);
  });

  test("does not expose the legacy theme toggle", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".theme-toggle")).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveClass(/matrix|starwars/);
  });

  test("renders the redesigned 404 page", async ({ page }) => {
    await page.goto("/missing-route");

    await expect(page.getByText("404", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Route not found\./i })
    ).toBeVisible();
  });

  test("renders the localized 404 page", async ({ page }) => {
    await page.goto("/tr/olmayan-sayfa");

    await expect(
      page.getByRole("heading", { name: /Rota bulunamadı\./i })
    ).toBeVisible();
  });
});
