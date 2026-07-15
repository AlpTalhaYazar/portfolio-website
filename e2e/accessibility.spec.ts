import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { mockCsrfToken } from "./support/mockCsrf";

for (const route of ["/", "/en"] as const) {
  for (const theme of ["light", "dark"] as const) {
    test(`${route} has no automated WCAG A/AA violations in ${theme} theme`, async ({
      page,
    }) => {
      await mockCsrfToken(page);
      await page.addInitScript((selectedTheme) => {
        window.localStorage.setItem("aty-theme", selectedTheme);
      }, theme);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      await page.locator("footer").scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.locator("#hero").scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }
}
