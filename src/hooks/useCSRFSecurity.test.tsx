import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SECURITY_CONSTANTS } from "@/types";

import { useCSRFSecurity } from "./useCSRFSecurity";

const SECURITY_STORAGE_KEY = "portfolio.csrf-security";

describe("useCSRFSecurity", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("reuses a persisted valid security session without refetching", async () => {
    sessionStorage.setItem(
      SECURITY_STORAGE_KEY,
      JSON.stringify({
        csrfToken: "persisted-token",
        sessionId: "persisted-session",
        tokenExpires:
          Date.now() + SECURITY_CONSTANTS.CSRF_REFRESH_THRESHOLD + 60_000,
      })
    );

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        token: "fresh-token",
        sessionId: "fresh-session",
        expires: Date.now() + 3_600_000,
      }),
    });
    global.fetch = fetchMock as typeof fetch;

    const { result } = renderHook(() => useCSRFSecurity());

    await waitFor(() => {
      expect(result.current.isSecurityLoading).toBe(false);
    });

    expect(result.current.csrfToken).toBe("persisted-token");
    expect(result.current.sessionId).toBe("persisted-session");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
