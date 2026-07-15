import { afterEach, describe, expect, it, vi } from "vitest";

import { logger, redactLogValue } from "@/lib/logger";

describe("structured logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("recursively redacts secrets, contact data, request bodies, and errors", () => {
    const redacted = redactLogValue({
      eventCode: "contact.failed",
      nested: {
        csrfToken: "secret-token-value",
        email: "person@example.com",
        ipAddress: "203.0.113.10",
        message: "private contact message",
        authorization: "Bearer secret",
      },
      error: new Error("SMTP password leaked in error text"),
      safeCount: 3,
    });

    expect(redacted).toMatchObject({
      eventCode: "contact.failed",
      nested: {
        csrfToken: "[REDACTED]",
        email: "[REDACTED]",
        ipAddress: "[REDACTED]",
        message: "[REDACTED]",
        authorization: "[REDACTED]",
      },
      error: { name: "Error" },
      safeCount: 3,
    });
    expect(JSON.stringify(redacted)).not.toContain("person@example.com");
    expect(JSON.stringify(redacted)).not.toContain("SMTP password");
  });

  it("emits one JSON event without leaking sensitive values", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    logger.error("contact.delivery_failed", {
      policy: "contact",
      token: "secret-token-value",
      email: "person@example.com",
    });

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const output = String(consoleSpy.mock.calls[0][0]);
    expect(() => JSON.parse(output)).not.toThrow();
    expect(output).toContain("contact.delivery_failed");
    expect(output).toContain("[REDACTED]");
    expect(output).not.toContain("secret-token-value");
    expect(output).not.toContain("person@example.com");
  });
});
