import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("serves dependency-free liveness without operational disclosure", async () => {
    const response = await GET(
      new NextRequest(
        "https://www.alptalha.dev/api/health/?probe=liveness"
      )
    );
    const body = (await response.json()) as Record<string, unknown>;

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store, max-age=0");
    expect(body).toMatchObject({ status: "healthy", probe: "liveness" });
    expect(body).not.toHaveProperty("environment");
    expect(body).not.toHaveProperty("uptime");
    expect(body).not.toHaveProperty("version");
    expect(body).not.toHaveProperty("checks");
  });
});
