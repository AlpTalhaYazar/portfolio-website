import { expect, test } from "@playwright/test";

import { mockCsrfToken } from "./support/mockCsrf";

test("Analytics stays silent until opt-in and withdrawal blocks later collection", async ({
  page,
}) => {
  test.skip(
    !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    "Analytics is not configured in this build"
  );

  const analyticsRequests: string[] = [];
  await page.route(/https:\/\/(?:www\.)?(?:googletagmanager|google-analytics)\.com\//, async (route) => {
    analyticsRequests.push(route.request().url());
    await route.abort("blockedbyclient");
  });
  await page.addInitScript(() => {
    window.localStorage.removeItem("aty-analytics-consent");
  });
  await mockCsrfToken(page, { analyticsDecision: null });

  await page.goto("/en");
  const consentRegion = page.getByRole("region", {
    name: "Analytics preferences",
  });

  await expect(consentRegion).toBeVisible();
  expect(analyticsRequests).toEqual([]);

  await page.getByRole("button", { name: "Accept analytics" }).click();
  await expect.poll(() => analyticsRequests.length).toBeGreaterThan(0);

  await page.getByRole("button", { name: "Privacy choices" }).click();
  await expect(
    page.getByRole("dialog", { name: "Analytics preferences" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Reject analytics" }).click();

  const disabledKeys = await page.evaluate(() =>
    Object.keys(window).filter(
      (key) => key.startsWith("ga-disable-") && window[key as `ga-disable-${string}`] === true
    )
  );
  expect(disabledKeys).not.toEqual([]);

  const requestCountAfterWithdrawal = analyticsRequests.length;
  await page.reload();
  await page.waitForTimeout(300);
  expect(analyticsRequests).toHaveLength(requestCountAfterWithdrawal);
});

test("privacy information is localized and reachable", async ({ page }) => {
  await mockCsrfToken(page);

  await page.goto("/privacy");
  await expect(
    page.getByRole("heading", { name: "Bu portfolyo verileri nasıl işler" })
  ).toBeVisible();

  await page.goto("/en/privacy");
  await expect(
    page.getByRole("heading", { name: "How this portfolio handles data" })
  ).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.alptalha.dev/en/privacy/"
  );
});
