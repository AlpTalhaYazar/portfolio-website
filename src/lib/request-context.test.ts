import { describe, expect, it } from "vitest";

import { buildRequestContextHeaders } from "./request-context";

describe("buildRequestContextHeaders", () => {
  it("adds locale, pathname, and nonce to the server-readable request headers", () => {
    const requestHeaders = buildRequestContextHeaders(
      new Headers([["accept", "text/html"]]),
      "/tr/projects",
      "nonce-123"
    );

    expect(requestHeaders.get("accept")).toBe("text/html");
    expect(requestHeaders.get("x-locale")).toBe("tr");
    expect(requestHeaders.get("x-pathname")).toBe("/tr/projects");
    expect(requestHeaders.get("x-nonce")).toBe("nonce-123");
  });
});
