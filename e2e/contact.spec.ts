import { expect, test } from "@playwright/test";

import { mockCsrfToken } from "./support/mockCsrf";

test.describe("Contact form", () => {
  test.beforeEach(async ({ page }) => {
    await mockCsrfToken(page);
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
  });

  test("renders the real contact form fields", async ({ page }) => {
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Subject")).toBeVisible();
    await expect(page.getByLabel("Message")).toBeVisible();
    await expect(page.getByRole("button", { name: /Send Message/i })).toBeVisible();
  });

  test("shows client-side validation messages", async ({ page }) => {
    await page.getByRole("button", { name: /Send Message/i }).click();

    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Please enter a subject.")).toBeVisible();
    await expect(page.getByText("Message must be at least 10 characters.")).toBeVisible();
  });

  test("shows the success state after a successful submission", async ({
    page,
  }) => {
    await page.route("**/api/contact/", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, message: "ok" }),
      });
    });

    await page.getByLabel("Name").fill("Alp Talha Yazar");
    await page.getByLabel("Email").fill("alp@example.com");
    await page.getByLabel("Subject").fill("Backend collaboration");
    await page
      .getByLabel("Message")
      .fill("I would like to discuss a backend engineering opportunity.");

    await page.getByRole("button", { name: /Send Message/i }).click();

    await expect(
      page.getByText("Message received. I'll get back to you as soon as possible.")
    ).toBeVisible();
  });
});
