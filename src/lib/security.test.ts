import { describe, it, expect, beforeEach } from "vitest";

// Test the security utilities
// Note: We're testing the public interface of the security module

describe("Security Constants", () => {
  it("should have correct CSRF token expiry (1 hour)", async () => {
    const { SECURITY_CONSTANTS } = await import("@/types");
    expect(SECURITY_CONSTANTS.CSRF_TOKEN_EXPIRY).toBe(60 * 60 * 1000);
  });

  it("should have correct default rate limit window (15 minutes)", async () => {
    const { SECURITY_CONSTANTS } = await import("@/types");
    expect(SECURITY_CONSTANTS.DEFAULT_RATE_LIMIT_WINDOW).toBe(15 * 60 * 1000);
  });

  it("should have 6 progressive blocking levels", async () => {
    const { SECURITY_CONSTANTS } = await import("@/types");
    expect(Object.keys(SECURITY_CONSTANTS.BLOCK_DURATIONS)).toHaveLength(6);
  });

  it("should escalate blocking durations correctly", async () => {
    const { SECURITY_CONSTANTS } = await import("@/types");
    const durations = SECURITY_CONSTANTS.BLOCK_DURATIONS;

    expect(durations.LEVEL_1).toBe(5 * 60 * 1000); // 5 minutes
    expect(durations.LEVEL_2).toBe(10 * 60 * 1000); // 10 minutes
    expect(durations.LEVEL_3).toBe(30 * 60 * 1000); // 30 minutes
    expect(durations.LEVEL_4).toBe(60 * 60 * 1000); // 1 hour
    expect(durations.LEVEL_5).toBe(2 * 60 * 60 * 1000); // 2 hours
    expect(durations.LEVEL_6).toBe(24 * 60 * 60 * 1000); // 24 hours
  });
});

describe("Input Sanitization", () => {
  let sanitizeInput: (input: string) => string;

  beforeEach(async () => {
    const security = await import("@/lib/security");
    sanitizeInput = security.sanitizeInput;
  });

  it("should trim whitespace", () => {
    expect(sanitizeInput("  hello world  ")).toBe("hello world");
  });

  it("should remove script tags", () => {
    expect(sanitizeInput('Hello <script>alert("xss")</script> World')).toBe(
      "Hello  World"
    );
  });

  it("should remove javascript: protocol", () => {
    // The sanitization removes 'javascript:' but keeps the rest
    const result = sanitizeInput('Click javascript:alert("xss")');
    expect(result).not.toContain("javascript:");
  });

  it("should remove event handlers", () => {
    expect(sanitizeInput('<img src="x" onerror="alert(1)">')).toBe(
      '<img src="x" "alert(1)">'
    );
  });

  it("should limit length to 5000 characters", () => {
    const longString = "a".repeat(6000);
    expect(sanitizeInput(longString).length).toBe(5000);
  });
});

describe("Honeypot Validation", () => {
  let validateHoneypot: (value: string | null | undefined) => boolean;

  beforeEach(async () => {
    const security = await import("@/lib/security");
    validateHoneypot = security.validateHoneypot;
  });

  it("should return true for empty string (valid)", () => {
    expect(validateHoneypot("")).toBe(true);
  });

  it("should return true for null (valid)", () => {
    expect(validateHoneypot(null)).toBe(true);
  });

  it("should return true for undefined (valid)", () => {
    expect(validateHoneypot(undefined)).toBe(true);
  });

  it("should return true for whitespace only (valid)", () => {
    expect(validateHoneypot("   ")).toBe(true);
  });

  it("should return false for filled honeypot (bot detected)", () => {
    expect(validateHoneypot("bot filled this")).toBe(false);
  });
});

describe("Spam Detection", () => {
  let detectSpam: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => boolean;

  beforeEach(async () => {
    const security = await import("@/lib/security");
    detectSpam = security.detectSpam;
  });

  it("should detect spam keywords", () => {
    expect(
      detectSpam({
        name: "Spammer",
        email: "spam@test.com",
        subject: "Great deal",
        message: "Buy cheap viagra now!",
      })
    ).toBe(true);
  });

  it("should detect excessive links", () => {
    expect(
      detectSpam({
        name: "Linker",
        email: "link@test.com",
        subject: "Check these out",
        message:
          "Visit https://site1.com and https://site2.com and https://site3.com",
      })
    ).toBe(true);
  });

  it("should detect repeated characters", () => {
    expect(
      detectSpam({
        name: "Test",
        email: "test@test.com",
        subject: "Hi",
        message: "aaaaaaaaaaaaaaaaa this is spam",
      })
    ).toBe(true);
  });

  it("should detect all caps messages", () => {
    expect(
      detectSpam({
        name: "Test",
        email: "test@test.com",
        subject: "Hi",
        message: "THIS IS A VERY LONG ALL CAPS MESSAGE THAT LOOKS LIKE SPAM",
      })
    ).toBe(true);
  });

  it("should allow legitimate messages", () => {
    expect(
      detectSpam({
        name: "John Doe",
        email: "john@example.com",
        subject: "Collaboration opportunity",
        message: "Hi, I would like to discuss a potential project together.",
      })
    ).toBe(false);
  });
});

describe("Type Guards", () => {
  it("should validate valid themes", async () => {
    const { isTheme } = await import("@/types");

    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("matrix")).toBe(true);
    expect(isTheme("starwars")).toBe(true);
    expect(isTheme("system")).toBe(true);
  });

  it("should reject invalid themes", async () => {
    const { isTheme } = await import("@/types");

    expect(isTheme("invalid")).toBe(false);
    expect(isTheme("")).toBe(false);
    expect(isTheme(null)).toBe(false);
    expect(isTheme(undefined)).toBe(false);
    expect(isTheme(123)).toBe(false);
  });

  it("should validate emails correctly", async () => {
    const { isValidEmail } = await import("@/types");

    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
    expect(isValidEmail("invalid")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
  });

  it("should validate non-empty strings", async () => {
    const { isNonEmptyString } = await import("@/types");

    expect(isNonEmptyString("hello")).toBe(true);
    expect(isNonEmptyString("")).toBe(false);
    expect(isNonEmptyString("   ")).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);
    expect(isNonEmptyString(123)).toBe(false);
  });
});
