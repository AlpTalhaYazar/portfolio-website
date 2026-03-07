import type { Page } from "@playwright/test";

export async function mockCsrfToken(page: Page) {
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
