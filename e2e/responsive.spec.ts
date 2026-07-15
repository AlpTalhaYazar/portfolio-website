import { expect, test } from "@playwright/test";

import { mockCsrfToken } from "./support/mockCsrf";

const cases = [
  { name: "mobile", width: 360, height: 800, route: "/", theme: "light" },
  { name: "tablet", width: 768, height: 1024, route: "/en", theme: "dark" },
  { name: "desktop", width: 1440, height: 900, route: "/", theme: "light" },
] as const;

for (const viewport of cases) {
  test(`${viewport.name} ${viewport.width}x${viewport.height} has no horizontal overflow or runtime errors`, async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium-desktop",
      "exact viewport matrix runs once in desktop Chromium"
    );

    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("requestfailed", (request) => {
      const url = new URL(request.url());
      const isCancelledRscPrefetch =
        request.failure()?.errorText === "net::ERR_ABORTED" &&
        url.origin === "http://localhost:3000" &&
        url.searchParams.has("_rsc");
      if (isCancelledRscPrefetch) return;

      failedRequests.push(
        `${request.method()} ${request.url()} ${request.failure()?.errorText ?? "failed"}`
      );
    });

    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript((theme) => {
      window.localStorage.setItem("aty-theme", theme);
    }, viewport.theme);
    await mockCsrfToken(page);

    const response = await page.goto(viewport.route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();

    for (const sectionId of ["#hero", "#about", "#projects", "#contact"]) {
      await page.locator(sectionId).scrollIntoViewIfNeeded();
    }
    await page.waitForTimeout(500);

    const overflow = await page.evaluate(() => {
      const tolerance = 1;
      const offenders = Array.from(document.querySelectorAll<HTMLElement>("body *"))
        .flatMap((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 &&
            (rect.left < -tolerance || rect.right > window.innerWidth + tolerance)
            ? [
                {
                  tag: element.tagName.toLowerCase(),
                  id: element.id,
                  className: element.className.toString().slice(0, 120),
                  left: Math.round(rect.left),
                  right: Math.round(rect.right),
                },
              ]
            : [];
        })
        .slice(0, 10);

      return {
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        offenders,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      };
    });

    expect(overflow.reducedMotion).toBe(true);
    expect(overflow.documentWidth, JSON.stringify(overflow.offenders)).toBeLessThanOrEqual(
      overflow.viewportWidth + 1
    );
    expect(overflow.offenders).toEqual([]);
    await expect(page.locator("html")).toHaveClass(
      viewport.theme === "dark" ? /dark-theme/ : /light-theme/
    );
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });
}
