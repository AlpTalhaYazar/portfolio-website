import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { proxy } from "@/proxy";

function request(pathname: string) {
  return new NextRequest(`https://www.alptalha.dev${pathname}`);
}

describe("proxy route policy", () => {
  it.each(["/robots.txt", "/sitemap.xml", "/manifest.json", "/icon.svg"])(
    "allows the public metadata route %s through to App Router",
    async (pathname) => {
      const response = await proxy(request(pathname));

      expect(response.status).toBe(200);
      expect(response.headers.get("x-middleware-next")).toBe("1");
      expect(response.headers.get("content-security-policy")).toContain(
        "default-src 'self'"
      );
    }
  );

  it.each(["/.env", "/.env.local", "/.git/config", "/admin", "/admin/users"])(
    "blocks the sensitive path %s",
    async (pathname) => {
      const response = await proxy(request(pathname));

      expect(response.status).toBe(403);
    }
  );

  it.each(["/administrator-portfolio", "/projects/admin-tools"])(
    "does not block a benign path containing a sensitive-looking substring: %s",
    async (pathname) => {
      const response = await proxy(request(pathname));

      expect(response.status).toBe(200);
      expect(response.headers.get("x-middleware-next")).toBe("1");
    }
  );

  it("permanently redirects the duplicate Turkish locale while preserving query parameters", async () => {
    const response = await proxy(request("/tr/?from=test"));

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "https://www.alptalha.dev/?from=test"
    );
  });

  it("does not upgrade local HTTP subresources to HTTPS", async () => {
    const response = await proxy(new NextRequest("http://localhost:3000/"));

    expect(response.headers.get("content-security-policy")).not.toContain(
      "upgrade-insecure-requests"
    );
  });

  it("upgrades subresources on HTTPS origins", async () => {
    const response = await proxy(request("/"));

    expect(response.headers.get("content-security-policy")).toContain(
      "upgrade-insecure-requests"
    );
  });
});
