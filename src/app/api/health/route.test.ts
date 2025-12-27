import { describe, it, expect } from "vitest";

describe("Health Check Endpoint", () => {
  it("should be accessible at /api/health", async () => {
    // This is a basic structure test - actual endpoint testing would require
    // running the dev server or using supertest
    const { GET } = await import("@/app/api/health/route");
    expect(GET).toBeDefined();
    expect(typeof GET).toBe("function");
  });
});

describe("Health Status Types", () => {
  it("should return proper health status structure", async () => {
    // Mock the response by importing and checking the shape
    const { GET } = await import("@/app/api/health/route");
    
    // Create a mock request context
    const response = await GET();
    const data = await response.json();
    
    // Verify structure
    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("timestamp");
    expect(data).toHaveProperty("version");
    expect(data).toHaveProperty("environment");
    expect(data).toHaveProperty("checks");
    expect(data).toHaveProperty("uptime");
    
    // Verify status is one of expected values
    expect(["healthy", "degraded", "unhealthy"]).toContain(data.status);
    
    // Verify checks structure
    expect(data.checks).toHaveProperty("email");
    expect(data.checks).toHaveProperty("redis");
    expect(data.checks).toHaveProperty("analytics");
  });

  it("should return correct HTTP status based on health", async () => {
    const { GET } = await import("@/app/api/health/route");
    
    const response = await GET();
    const data = await response.json();
    
    // If unhealthy, status should be 503
    if (data.status === "unhealthy") {
      expect(response.status).toBe(503);
    } else {
      expect(response.status).toBe(200);
    }
  });

  it("should include Cache-Control header", async () => {
    const { GET } = await import("@/app/api/health/route");
    
    const response = await GET();
    
    expect(response.headers.get("Cache-Control")).toBe("no-store, max-age=0");
  });
});
