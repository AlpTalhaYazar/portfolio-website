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
    it("uses turkish for the root route", () => {
      expect(getLocaleFromPathname("/")).toBe("tr");
    });

    it("reads prefixed locale routes", () => {
      expect(getLocaleFromPathname("/en")).toBe("en");
      expect(getLocaleFromPathname("/en/projects")).toBe("en");
      expect(getLocaleFromPathname("/tr")).toBe("tr");
      expect(getLocaleFromPathname("/tr/projects")).toBe("tr");
    });

    it("falls back to turkish for unknown prefixes", () => {
      expect(getLocaleFromPathname("/de")).toBe("tr");
      expect(getLocaleFromPathname("/es/contact")).toBe("tr");
      expect(getLocaleFromPathname("/work")).toBe("tr");
    });
  });

  describe("stripLocaleFromPathname", () => {
    it("removes public locale prefixes while preserving root semantics", () => {
      expect(stripLocaleFromPathname("/en")).toBe("/");
      expect(stripLocaleFromPathname("/en/projects")).toBe("/projects");
      expect(stripLocaleFromPathname("/tr")).toBe("/");
      expect(stripLocaleFromPathname("/tr/projects")).toBe("/projects");
      expect(stripLocaleFromPathname("/es")).toBe("/es");
      expect(stripLocaleFromPathname("/about")).toBe("/about");
    });
  });

  describe("buildLocalizedHref", () => {
    it("builds turkish hrefs without a prefix", () => {
      expect(buildLocalizedHref("tr", "/")).toBe("/");
      expect(buildLocalizedHref("tr", "/en#contact")).toBe("/#contact");
      expect(buildLocalizedHref("tr", "/tr#contact")).toBe("/#contact");
      expect(buildLocalizedHref("tr", "/es/projects?tab=selected")).toBe(
        "/es/projects?tab=selected"
      );
    });

    it("adds locale prefixes for english routes", () => {
      expect(buildLocalizedHref("en", "/")).toBe("/en");
      expect(buildLocalizedHref("en", "/#contact")).toBe("/en#contact");
    });

    it("preserves query strings and hash fragments", () => {
      expect(buildLocalizedHref("en", "/projects?tab=selected#contact")).toBe(
        "/en/projects?tab=selected#contact"
      );
      expect(buildLocalizedHref("tr", "/en?view=compact#hero")).toBe(
        "/?view=compact#hero"
      );
    });
  });
});
