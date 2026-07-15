import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { verifyCsrfCredential } from "@/lib/csrf";
import { GET } from "./route";

vi.mock("@/lib/logger", () => ({
  logger: {
    dev: { log: vi.fn(), warn: vi.fn(), error: vi.fn() },
    security: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

const SITE_URL = "https://www.alptalha.dev";
const SECRET = "test-csrf-secret-with-at-least-thirty-two-characters";

function makeRequest(origin = SITE_URL) {
  return new NextRequest(`${SITE_URL}/api/csrf-token/`, {
    headers: {
      origin,
      referer: `${origin}/`,
      "user-agent": "route-test",
    },
  });
}

describe("GET /api/csrf-token", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("CSRF_SECRET", SECRET);
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE_URL);
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", SITE_URL);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("issues a stateless credential in a no-store response and HttpOnly host cookie", async () => {
    const response = await GET(makeRequest());
    const body = (await response.json()) as {
      success: boolean;
      token: string;
      sessionId: string;
      expires: number;
      expiresIn: number;
    };

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("set-cookie")).toContain(
      `__Host-portfolio-csrf=${body.token}`
    );
    expect(response.headers.get("set-cookie")).toMatch(/HttpOnly/i);
    expect(response.headers.get("set-cookie")).toMatch(/Secure/i);
    expect(response.headers.get("set-cookie")).toMatch(/SameSite=strict/i);
    expect(response.headers.get("set-cookie")).toContain("Path=/");
    expect(body).toMatchObject({ success: true });
    expect(body.expiresIn).toBeGreaterThan(0);
    expect(
      verifyCsrfCredential({
        secret: SECRET,
        token: body.token,
        cookieToken: body.token,
        sessionId: body.sessionId,
      })
    ).toEqual({ valid: true });
  });

  it("rejects a cross-origin request without exposing internal details", async () => {
    const response = await GET(makeRequest("https://attacker.example"));
    const body = (await response.json()) as Record<string, unknown>;

    expect(response.status).toBe(403);
    expect(body).toEqual({
      success: false,
      code: "origin_forbidden",
      error: "Request origin is not allowed.",
    });
    expect(body).not.toHaveProperty("details");
  });

  it("issues a credential to a same-origin local production request", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = await GET(
      new NextRequest("http://localhost:3000/api/csrf-token/", {
        headers: {
          referer: "http://localhost:3000/en/",
          "user-agent": "route-test",
        },
      })
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("portfolio-csrf=");
    expect(response.headers.get("set-cookie")).not.toContain(
      "__Host-portfolio-csrf="
    );
    expect(response.headers.get("set-cookie")).not.toMatch(/; Secure/i);
  });
});
