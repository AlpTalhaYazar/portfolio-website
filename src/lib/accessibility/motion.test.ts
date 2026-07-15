import { describe, expect, it, vi } from "vitest";
import { getPreferredScrollBehavior } from "./motion";

describe("getPreferredScrollBehavior", () => {
  it("uses instant scrolling when reduced motion is requested", () => {
    const matchMedia = vi.fn(() => ({ matches: true }));

    expect(getPreferredScrollBehavior(matchMedia)).toBe("auto");
  });

  it("keeps smooth scrolling for users without that preference", () => {
    const matchMedia = vi.fn(() => ({ matches: false }));

    expect(getPreferredScrollBehavior(matchMedia)).toBe("smooth");
  });
});
