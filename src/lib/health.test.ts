import { describe, expect, it, vi } from "vitest";

import { createHealthService } from "@/lib/health";

describe("readiness health service", () => {
  it("reports healthy only after required non-mutating probes succeed", async () => {
    const probeEmail = vi.fn().mockResolvedValue(undefined);
    const probeRedis = vi.fn().mockResolvedValue(undefined);
    const service = createHealthService({
      emailState: "configured",
      redisState: "configured",
      probeEmail,
      probeRedis,
      cacheTtlMs: 0,
    });

    await expect(service.checkReadiness()).resolves.toEqual({
      status: "healthy",
      checks: { email: "ok", redis: "ok" },
    });
    expect(probeEmail).toHaveBeenCalledTimes(1);
    expect(probeRedis).toHaveBeenCalledTimes(1);
  });

  it("reports a required dependency timeout as unhealthy without error detail", async () => {
    const service = createHealthService({
      emailState: "configured",
      redisState: "unconfigured",
      probeEmail: () => new Promise(() => undefined),
      probeRedis: vi.fn(),
      timeoutMs: 5,
      cacheTtlMs: 0,
    });

    await expect(service.checkReadiness()).resolves.toEqual({
      status: "unhealthy",
      checks: { email: "error", redis: "disabled" },
    });
  });

  it("treats intentionally unconfigured optional Redis as degraded", async () => {
    const probeRedis = vi.fn();
    const service = createHealthService({
      emailState: "configured",
      redisState: "unconfigured",
      probeEmail: vi.fn().mockResolvedValue(undefined),
      probeRedis,
      cacheTtlMs: 0,
    });

    await expect(service.checkReadiness()).resolves.toEqual({
      status: "degraded",
      checks: { email: "ok", redis: "disabled" },
    });
    expect(probeRedis).not.toHaveBeenCalled();
  });

  it("reports partial dependency configuration as unhealthy", async () => {
    const service = createHealthService({
      emailState: "invalid",
      redisState: "invalid",
      probeEmail: vi.fn(),
      probeRedis: vi.fn(),
      cacheTtlMs: 0,
    });

    await expect(service.checkReadiness()).resolves.toEqual({
      status: "unhealthy",
      checks: { email: "error", redis: "error" },
    });
  });

  it("caches readiness briefly to avoid probing dependencies on every request", async () => {
    let now = 1_000;
    const probeEmail = vi.fn().mockResolvedValue(undefined);
    const service = createHealthService({
      emailState: "configured",
      redisState: "unconfigured",
      probeEmail,
      probeRedis: vi.fn(),
      cacheTtlMs: 30_000,
      now: () => now,
    });

    await service.checkReadiness();
    await service.checkReadiness();
    expect(probeEmail).toHaveBeenCalledTimes(1);

    now += 30_001;
    await service.checkReadiness();
    expect(probeEmail).toHaveBeenCalledTimes(2);
  });
});
