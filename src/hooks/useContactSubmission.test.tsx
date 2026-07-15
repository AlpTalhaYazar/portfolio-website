import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { UseCSRFSecurityReturn } from "./useCSRFSecurity";
import { useContactSubmission } from "./useContactSubmission";

describe("useContactSubmission", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("uses credentials returned by a refresh in the same submit attempt", async () => {
    const freshCredential = {
      success: true,
      token: "fresh-token",
      sessionId: "fresh-session",
      expires: Date.now() + 3_600_000,
      expiresIn: 3_600,
    };
    const security = {
      csrfToken: "stale-token",
      sessionId: "stale-session",
      tokenExpires: Date.now() - 1,
      isSecurityLoading: false,
      securityError: null,
      fetchCSRFToken: vi.fn().mockResolvedValue(freshCredential),
      clearSecurityError: vi.fn(),
      isTokenExpired: () => true,
      isTokenValid: () => false,
    } as unknown as UseCSRFSecurityReturn;

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers(),
      json: async () => ({ success: true }),
    });
    global.fetch = fetchMock as typeof fetch;

    const { result, unmount } = renderHook(() =>
      useContactSubmission(security)
    );

    await act(async () => {
      await expect(
        result.current.onSubmit({
          name: "Ada Lovelace",
          email: "ada@example.com",
          subject: "Project discussion",
          message: "I would like to discuss a backend project.",
          honeypot: "",
        })
      ).resolves.toBe(true);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.headers).toMatchObject({ "x-session-id": "fresh-session" });
    expect(JSON.parse(String(init.body))).toMatchObject({
      csrfToken: "fresh-token",
    });

    unmount();
  });

  it("maps dependency failures to localized public copy without trusting the body", async () => {
    const security = {
      csrfToken: "token",
      sessionId: "session",
      tokenExpires: Date.now() + 60_000,
      isSecurityLoading: false,
      securityError: null,
      fetchCSRFToken: vi.fn(),
      clearSecurityError: vi.fn(),
      isTokenExpired: () => false,
      isTokenValid: () => true,
    } as unknown as UseCSRFSecurityReturn;
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      headers: new Headers(),
      json: async () => {
        throw new SyntaxError("upstream HTML response");
      },
    }) as typeof fetch;
    const messages = {
      security: "Güvenlik doğrulaması başarısız.",
      rateLimited: "Çok fazla istek. {minutes} dakika bekleyin.",
      unavailable: "Servis geçici olarak kullanılamıyor.",
      failed: "Mesaj gönderilemedi.",
    };

    const { result } = renderHook(() =>
      useContactSubmission(security, messages)
    );

    await act(async () => {
      await expect(
        result.current.onSubmit({
          name: "Ada Lovelace",
          email: "ada@example.com",
          subject: "Project discussion",
          message: "Backend sistemi hakkında görüşmek istiyorum.",
        })
      ).resolves.toBe(false);
    });

    expect(result.current.submitError).toBe(messages.unavailable);
  });
});
