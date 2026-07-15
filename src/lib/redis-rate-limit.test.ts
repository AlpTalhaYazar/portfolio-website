import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

import { createRateLimitService } from "@/lib/redis-rate-limit";

const CONTACT_POLICY = {
  name: "contact",
  windowMs: 60_000,
  maxRequests: 2,
  failureMode: "closed" as const,
};

function makeRequest(ip = "203.0.113.10") {
  return new NextRequest("https://www.alptalha.dev/api/contact/", {
    headers: { "x-vercel-forwarded-for": ip },
  });
}

describe("rate-limit service", () => {
  it("uses Redis when configured and returns its decision", async () => {
    const redisLimit = vi.fn().mockResolvedValue({
      success: true,
      remaining: 1,
      reset: 100_000,
    });
    const service = createRateLimitService({
      redisState: "configured",
      redisLimit,
      hashIdentifier: async () => "hashed-client",
      now: () => 1_000,
    });

    await expect(service.check(makeRequest(), CONTACT_POLICY)).resolves.toEqual({
      allowed: true,
      backend: "redis",
      degraded: false,
      remainingRequests: 1,
      resetTime: 100_000,
    });
    expect(redisLimit).toHaveBeenCalledWith(
      CONTACT_POLICY,
      "hashed-client"
    );
  });

  it("fails a closed policy when configured Redis throws", async () => {
    const service = createRateLimitService({
      redisState: "configured",
      redisLimit: vi.fn().mockRejectedValue(new Error("timeout")),
      hashIdentifier: async () => "hashed-client",
      now: () => 1_000,
    });

    await expect(service.check(makeRequest(), CONTACT_POLICY)).resolves.toEqual({
      allowed: false,
      backend: "unavailable",
      degraded: true,
      reason: "dependency_unavailable",
    });
  });

  it("uses a degraded bounded memory fallback for an explicit fallback policy", async () => {
    const service = createRateLimitService({
      redisState: "configured",
      redisLimit: vi.fn().mockRejectedValue(new Error("timeout")),
      hashIdentifier: async () => "hashed-client",
      now: () => 1_000,
    });
    const policy = { ...CONTACT_POLICY, name: "csrf", failureMode: "memory" as const };

    await expect(service.check(makeRequest(), policy)).resolves.toMatchObject({
      allowed: true,
      backend: "memory",
      degraded: true,
      remainingRequests: 1,
    });
  });

  it("isolates counters by policy name for the same client", async () => {
    const service = createRateLimitService({
      redisState: "unconfigured",
      hashIdentifier: async () => "hashed-client",
      now: () => 1_000,
    });
    const csrfPolicy = {
      ...CONTACT_POLICY,
      name: "csrf",
      maxRequests: 1,
      failureMode: "memory" as const,
    };

    expect((await service.check(makeRequest(), csrfPolicy)).allowed).toBe(true);
    expect((await service.check(makeRequest(), csrfPolicy)).allowed).toBe(false);
    expect((await service.check(makeRequest(), CONTACT_POLICY)).allowed).toBe(true);
  });

  it("evicts expired/old entries instead of growing without a bound", async () => {
    let now = 1_000;
    const service = createRateLimitService({
      redisState: "unconfigured",
      hashIdentifier: async (value) => `hashed:${value}`,
      now: () => now,
      maxMemoryEntries: 2,
    });

    await service.check(makeRequest("203.0.113.1"), CONTACT_POLICY);
    await service.check(makeRequest("203.0.113.2"), CONTACT_POLICY);
    await service.check(makeRequest("203.0.113.3"), CONTACT_POLICY);
    expect(service.getMemoryEntryCount()).toBe(2);

    now += CONTACT_POLICY.windowMs + 1;
    await service.check(makeRequest("203.0.113.4"), CONTACT_POLICY);
    expect(service.getMemoryEntryCount()).toBe(1);
  });
});
