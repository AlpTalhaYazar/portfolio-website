import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { issueCsrfCredential } from "@/lib/csrf";
import { POST } from "./route";

const transport = vi.hoisted(() => ({
  verify: vi.fn(),
  sendMail: vi.fn(),
  createTransport: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: transport.createTransport,
  },
}));

vi.mock("@/lib/env", () => ({
  serverEnv: {
    gmailUser: "portfolio@example.com",
    gmailAppPassword: "test-app-password-not-real",
    emailTo: "owner@example.com",
  },
  clientEnv: {
    siteUrl: "https://www.alptalha.dev",
    baseUrl: "https://www.alptalha.dev",
  },
}));

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

const validBody = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Backend project discussion",
  message: "I would like to discuss a reliable backend platform.",
  honeypot: "",
};

function createCredential() {
  return issueCsrfCredential({ secret: SECRET });
}

function makeRequest({
  body = validBody,
  rawBody,
  includeCookie = true,
}: {
  body?: Record<string, unknown>;
  rawBody?: string;
  includeCookie?: boolean;
} = {}) {
  const credential = createCredential();
  const requestBody = rawBody ??
    JSON.stringify({ ...body, csrfToken: credential.token });
  const headers = new Headers({
    "content-type": "application/json",
    origin: SITE_URL,
    referer: `${SITE_URL}/`,
    "user-agent": "route-test",
    "x-session-id": credential.sessionId,
  });

  if (includeCookie) {
    headers.set("cookie", `__Host-portfolio-csrf=${credential.token}`);
  }

  return new NextRequest(`${SITE_URL}/api/contact/`, {
    method: "POST",
    headers,
    body: requestBody,
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("CSRF_SECRET", SECRET);
    transport.verify.mockResolvedValue(true);
    transport.sendMail.mockResolvedValue({ messageId: "test-message-id" });
    transport.createTransport.mockReturnValue({
      verify: transport.verify,
      sendMail: transport.sendMail,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("accepts a valid stateless CSRF credential and sends exactly one email", async () => {
    const response = await POST(makeRequest());
    const body = (await response.json()) as Record<string, unknown>;

    expect(response.status).toBe(200);
    expect(body).toEqual({
      success: true,
      message: "Message sent successfully.",
    });
    expect(transport.sendMail).toHaveBeenCalledTimes(1);
  });

  it("rejects a request without the matching HttpOnly CSRF cookie", async () => {
    const response = await POST(makeRequest({ includeCookie: false }));
    const body = (await response.json()) as Record<string, unknown>;

    expect(response.status).toBe(403);
    expect(body).toMatchObject({
      success: false,
      code: "csrf_invalid",
    });
    expect(transport.sendMail).not.toHaveBeenCalled();
  });

  it("maps malformed JSON to a stable 400 response without parser details", async () => {
    const response = await POST(makeRequest({ rawBody: "{" }));
    const body = (await response.json()) as Record<string, unknown>;

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      code: "invalid_json",
      error: "Request body must be valid JSON.",
    });
    expect(transport.sendMail).not.toHaveBeenCalled();
  });

  it("does not silently discard legitimate messages about security-sensitive industries", async () => {
    const response = await POST(
      makeRequest({
        body: {
          ...validBody,
          message:
            "We are hiring for an insurance and investment platform and would like to discuss your backend experience.",
        },
      })
    );

    expect(response.status).toBe(200);
    expect(transport.sendMail).toHaveBeenCalledTimes(1);
  });
});
