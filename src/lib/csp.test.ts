import { describe, expect, it } from "vitest";

import { buildCSPHeader } from "./csp";

describe("buildCSPHeader", () => {
  it("allows inline styles required by motion and font runtime", () => {
    const header = buildCSPHeader({ nonce: "test-nonce", isDevelopment: false });

    expect(header).toContain("style-src 'self' 'unsafe-inline' fonts.googleapis.com");
    expect(header).toContain("style-src-attr 'unsafe-inline'");
  });

  it("keeps unsafe-eval limited to development", () => {
    const developmentHeader = buildCSPHeader({
      nonce: "dev-nonce",
      isDevelopment: true,
    });
    const productionHeader = buildCSPHeader({
      nonce: "prod-nonce",
      isDevelopment: false,
    });

    expect(developmentHeader).toContain(
      "script-src 'self' 'nonce-dev-nonce' 'strict-dynamic' 'unsafe-eval'"
    );
    expect(productionHeader).not.toContain("'unsafe-eval'");
  });
});
