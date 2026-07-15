import { describe, expect, it } from "vitest";

import { issueCsrfCredential, verifyCsrfCredential } from "@/lib/csrf";

const SECRET = "test-csrf-secret-with-at-least-thirty-two-characters";
const NOW = Date.UTC(2026, 6, 15, 12, 0, 0);

describe("stateless CSRF credentials", () => {
  it("can be verified by a separate caller that shares only the signing secret", () => {
    const credential = issueCsrfCredential({ secret: SECRET, now: NOW });

    expect(
      verifyCsrfCredential({
        secret: SECRET,
        token: credential.token,
        cookieToken: credential.token,
        sessionId: credential.sessionId,
        now: NOW + 1_000,
      })
    ).toEqual({ valid: true });
  });

  it("rejects token tampering", () => {
    const credential = issueCsrfCredential({ secret: SECRET, now: NOW });
    const tampered = `${credential.token.slice(0, -1)}${
      credential.token.endsWith("a") ? "b" : "a"
    }`;

    expect(
      verifyCsrfCredential({
        secret: SECRET,
        token: tampered,
        cookieToken: tampered,
        sessionId: credential.sessionId,
        now: NOW + 1_000,
      })
    ).toEqual({ valid: false, reason: "invalid_signature" });
  });

  it("rejects expired credentials", () => {
    const credential = issueCsrfCredential({
      secret: SECRET,
      now: NOW,
      ttlMs: 1_000,
    });

    expect(
      verifyCsrfCredential({
        secret: SECRET,
        token: credential.token,
        cookieToken: credential.token,
        sessionId: credential.sessionId,
        now: NOW + 1_001,
      })
    ).toEqual({ valid: false, reason: "token_expired" });
  });

  it("rejects a missing or different cookie token", () => {
    const credential = issueCsrfCredential({ secret: SECRET, now: NOW });

    expect(
      verifyCsrfCredential({
        secret: SECRET,
        token: credential.token,
        cookieToken: undefined,
        sessionId: credential.sessionId,
        now: NOW,
      })
    ).toEqual({ valid: false, reason: "missing_cookie" });

    expect(
      verifyCsrfCredential({
        secret: SECRET,
        token: credential.token,
        cookieToken: "different-token",
        sessionId: credential.sessionId,
        now: NOW,
      })
    ).toEqual({ valid: false, reason: "cookie_mismatch" });
  });

  it("rejects a session header that does not match the signed payload", () => {
    const credential = issueCsrfCredential({ secret: SECRET, now: NOW });

    expect(
      verifyCsrfCredential({
        secret: SECRET,
        token: credential.token,
        cookieToken: credential.token,
        sessionId: "another-session",
        now: NOW,
      })
    ).toEqual({ valid: false, reason: "session_mismatch" });
  });

  it("rejects weak signing secrets", () => {
    expect(() => issueCsrfCredential({ secret: "too-short", now: NOW })).toThrow(
      /at least 32 characters/i
    );
  });
});
