import { describe, expect, it } from "vitest";

import {
  buildLocalizedHref,
  getLocaleFromPathname,
  isSupportedLocale,
  stripLocaleFromPathname,
} from "./routing";

describe("i18n routing helpers", () => {
  describe("isSupportedLocale", () => {
    it("returns true for supported locales", () => {
      expect(isSupportedLocale("en")).toBe(true);
      expect(isSupportedLocale("tr")).toBe(true);
    });

    it("returns false for unsupported locales", () => {
      expect(isSupportedLocale("de")).toBe(false);
      expect(isSupportedLocale("es")).toBe(false);
      expect(isSupportedLocale("")).toBe(false);
    });
  });

  describe("getLocaleFromPathname", () => {
    it("uses english for the root route", () => {
      expect(getLocaleFromPathname("/")).toBe("en");
    });

    it("reads prefixed locale routes", () => {
      expect(getLocaleFromPathname("/tr")).toBe("tr");
      expect(getLocaleFromPathname("/tr/projects")).toBe("tr");
    });

    it("falls back to english for unknown prefixes", () => {
      expect(getLocaleFromPathname("/de")).toBe("en");
      expect(getLocaleFromPathname("/es/contact")).toBe("en");
      expect(getLocaleFromPathname("/work")).toBe("en");
    });
  });

  describe("stripLocaleFromPathname", () => {
    it("removes locale prefixes while preserving root semantics", () => {
      expect(stripLocaleFromPathname("/tr")).toBe("/");
      expect(stripLocaleFromPathname("/tr/projects")).toBe("/projects");
      expect(stripLocaleFromPathname("/es")).toBe("/es");
      expect(stripLocaleFromPathname("/about")).toBe("/about");
    });
  });

  describe("buildLocalizedHref", () => {
    it("builds english hrefs without a prefix", () => {
      expect(buildLocalizedHref("en", "/")).toBe("/");
      expect(buildLocalizedHref("en", "/tr#contact")).toBe("/#contact");
      expect(buildLocalizedHref("en", "/es/projects?tab=selected")).toBe(
        "/es/projects?tab=selected"
      );
    });

    it("adds locale prefixes for non-default locales", () => {
      expect(buildLocalizedHref("tr", "/")).toBe("/tr");
      expect(buildLocalizedHref("tr", "/#contact")).toBe("/tr#contact");
    });

    it("preserves query strings and hash fragments", () => {
      expect(buildLocalizedHref("tr", "/projects?tab=selected#contact")).toBe(
        "/tr/projects?tab=selected#contact"
      );
      expect(buildLocalizedHref("en", "/tr?view=compact#hero")).toBe(
        "/?view=compact#hero"
      );
    });
  });
});
