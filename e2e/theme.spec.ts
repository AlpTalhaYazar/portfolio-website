import { expect, test } from "@playwright/test";

import { mockCsrfToken } from "./support/mockCsrf";

test.describe("Redesign shell", () => {
  test.beforeEach(async ({ page }) => {
    await mockCsrfToken(page);
  });

  test("does not expose the legacy theme toggle and defaults to the light theme", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem("aty-theme");
    });
    await page.goto("/");

    await expect(page.locator(".theme-toggle")).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveClass(/matrix|starwars/);
    await expect(page.locator("html")).toHaveClass(/light-theme/);
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      "#F4F2ED"
    );
  });

  test("persists the dark theme across reloads and 404 routes", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("button", { name: /koyu temaya geç|switch to dark theme/i })
      .first()
      .click();

    await expect(page.locator("html")).toHaveClass(/dark-theme/);
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      "#080808"
    );

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark-theme/);

    await page.goto("/en/missing-route");
    await expect(
      page.getByRole("button", { name: /switch to dark theme/i })
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /switch to light theme/i })
    ).toBeVisible();

    await page.goto("/olmayan-sayfa");
    await expect(page.locator("html")).toHaveClass(/dark-theme/);
  });

  test("renders the redesigned 404 page", async ({ page }) => {
    await page.goto("/missing-route");

    await expect(page.getByText("404", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Rota bulunamadı\./i })
    ).toBeVisible();
  });

  test("renders the localized 404 page", async ({ page }) => {
    await page.goto("/en/missing-route");

    await expect(
      page.getByRole("heading", { name: /Route not found\./i })
    ).toBeVisible();
  });

  test("uses the redesign light backdrop tint on the scrolled header", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("aty-theme", "light");
    });
    await page.goto("/");

    await page.evaluate(() => {
      window.scrollTo(0, 500);
    });

    await expect
      .poll(async () =>
        page.locator("header").evaluate((element) => {
          return window.getComputedStyle(element).backgroundColor;
        })
      )
      .toBe("rgba(244, 242, 237, 0.96)");
  });
});
