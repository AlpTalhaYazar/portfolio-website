import type { Page } from "@playwright/test";

export async function mockCsrfToken(
  page: Page,
  options: { analyticsDecision?: "accepted" | "rejected" | null } = {}
) {
  const analyticsDecision = Object.hasOwn(options, "analyticsDecision")
    ? options.analyticsDecision
    : "rejected";

  if (analyticsDecision) {
    await page.addInitScript((decision) => {
      window.localStorage.setItem(
        "aty-analytics-consent",
        JSON.stringify({
          version: 1,
          decision,
          updatedAt: new Date().toISOString(),
        })
      );
    }, analyticsDecision);
  }

  await page.route("**/api/csrf-token/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        token: "playwright-csrf-token",
        sessionId: "playwright-session-id",
        expires: Date.now() + 5 * 60 * 1000,
        expiresIn: 300,
      }),
    });
  });
}
