import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { validateHoneypot, verifyOrigin } from "./security";

function requestWith(
  headers: HeadersInit = {},
  url = "https://www.alptalha.dev/api/contact/"
) {
  return new NextRequest(url, { headers });
}

describe("verifyOrigin", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("accepts an exact configured origin", () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(
      verifyOrigin(requestWith({ origin: "https://www.alptalha.dev" }), [
        "https://www.alptalha.dev",
      ])
    ).toBe(true);
  });

  it("accepts the request URL's own origin for local and preview deployments", () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(
      verifyOrigin(
        requestWith(
          { referer: "http://localhost:3000/en/" },
          "http://localhost:3000/api/csrf-token/"
        ),
        ["https://www.alptalha.dev"]
      )
    ).toBe(true);
  });

  it("rejects missing, malformed, and lookalike origins in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    const allowed = ["https://www.alptalha.dev"];

    expect(verifyOrigin(requestWith(), allowed)).toBe(false);
    expect(verifyOrigin(requestWith({ referer: "not a url" }), allowed)).toBe(false);
    expect(
      verifyOrigin(
        requestWith({ origin: "https://www.alptalha.dev.evil.example" }),
        allowed
      )
    ).toBe(false);
  });

  it("allows only real loopback hosts as a development convenience", () => {
    vi.stubEnv("NODE_ENV", "development");

    expect(
      verifyOrigin(requestWith({ origin: "http://localhost:3000" }), [])
    ).toBe(true);
    expect(
      verifyOrigin(requestWith({ origin: "https://localhost.evil.example" }), [])
    ).toBe(false);
  });
});

describe("validateHoneypot", () => {
  it.each(["", "   ", null, undefined])("accepts an empty value", (value) => {
    expect(validateHoneypot(value)).toBe(true);
  });

  it("rejects a filled value", () => {
    expect(validateHoneypot("automated input")).toBe(false);
  });
});
