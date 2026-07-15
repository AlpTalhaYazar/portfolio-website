import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

import { getCsrfSecret } from "@/lib/csrf";
import { logger } from "@/lib/logger";
import type { RateLimitConfig, RateLimitResult } from "@/types";

type RedisState = "configured" | "unconfigured" | "invalid";

interface RedisLimitResult {
  readonly success: boolean;
  readonly remaining: number;
  readonly reset: number;
}

type RedisLimit = (
  policy: RateLimitConfig,
  identifier: string
) => Promise<RedisLimitResult>;

interface MemoryEntry {
  count: number;
  resetTime: number;
}

interface RateLimitServiceOptions {
  readonly redisState?: RedisState;
  readonly redisLimit?: RedisLimit;
  readonly hashIdentifier?: (value: string) => Promise<string>;
  readonly now?: () => number;
  readonly maxMemoryEntries?: number;
}

export interface RateLimitService {
  readonly check: (
    request: NextRequest,
    policy: RateLimitConfig
  ) => Promise<RateLimitResult>;
  readonly getMemoryEntryCount: () => number;
}

const DEFAULT_MAX_MEMORY_ENTRIES = 5_000;

let productionRedis: Redis | null = null;
const productionLimiters = new Map<string, Ratelimit>();

function resolveRedisState(): RedisState {
  const hasUrl = Boolean(process.env.UPSTASH_REDIS_REST_URL);
  const hasToken = Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

  if (!hasUrl && !hasToken) {
    return "unconfigured";
  }

  return hasUrl && hasToken ? "configured" : "invalid";
}

function getProductionRedis(): Redis {
  if (productionRedis) {
    return productionRedis;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error("Redis configuration is incomplete");
  }

  productionRedis = new Redis({ url, token });
  return productionRedis;
}

async function productionRedisLimit(
  policy: RateLimitConfig,
  identifier: string
): Promise<RedisLimitResult> {
  const cacheKey = `${policy.name}:${policy.windowMs}:${policy.maxRequests}`;
  let limiter = productionLimiters.get(cacheKey);

  if (!limiter) {
    const seconds = Math.max(1, Math.ceil(policy.windowMs / 1_000));
    limiter = new Ratelimit({
      redis: getProductionRedis(),
      limiter: Ratelimit.slidingWindow(
        policy.maxRequests,
        `${seconds} s`
      ),
      analytics: false,
      prefix: `portfolio:ratelimit:${policy.name}`,
    });
    productionLimiters.set(cacheKey, limiter);
  }

  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}

async function defaultHashIdentifier(value: string): Promise<string> {
  const material = new TextEncoder().encode(`${getCsrfSecret()}:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", material);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 40);
}

function validatePolicy(policy: RateLimitConfig): void {
  if (!/^[a-z0-9][a-z0-9_-]{1,63}$/i.test(policy.name)) {
    throw new Error("Rate-limit policy name is invalid");
  }

  if (
    !Number.isSafeInteger(policy.windowMs) ||
    policy.windowMs <= 0 ||
    !Number.isSafeInteger(policy.maxRequests) ||
    policy.maxRequests <= 0
  ) {
    throw new Error("Rate-limit policy values must be positive integers");
  }
}

export function getClientIP(request: NextRequest): string {
  const candidates = [
    request.headers.get("x-vercel-forwarded-for"),
    request.headers.get("cf-connecting-ip"),
    request.headers.get("x-forwarded-for")?.split(",")[0],
    request.headers.get("x-real-ip"),
  ];
  const candidate = candidates
    .find((value) => value?.trim())
    ?.trim()
    .slice(0, 128);

  return candidate || "unknown";
}

function getClientFingerprint(request: NextRequest): string {
  const ip = getClientIP(request);
  if (ip !== "unknown") {
    return `ip:${ip}`;
  }

  const userAgent = request.headers.get("user-agent")?.slice(0, 256) || "unknown";
  return `unknown:${userAgent}`;
}

export function createRateLimitService(
  options: RateLimitServiceOptions = {}
): RateLimitService {
  const memoryEntries = new Map<string, MemoryEntry>();
  const now = options.now ?? Date.now;
  const maxMemoryEntries =
    options.maxMemoryEntries ?? DEFAULT_MAX_MEMORY_ENTRIES;
  const hashIdentifier = options.hashIdentifier ?? defaultHashIdentifier;
  const redisLimit = options.redisLimit ?? productionRedisLimit;

  function cleanMemoryEntries(currentTime: number): void {
    for (const [key, entry] of memoryEntries) {
      if (entry.resetTime <= currentTime) {
        memoryEntries.delete(key);
      }
    }
  }

  function enforceMemoryBound(currentTime: number): void {
    cleanMemoryEntries(currentTime);

    while (memoryEntries.size >= maxMemoryEntries) {
      const oldestKey = memoryEntries.keys().next().value as string | undefined;
      if (!oldestKey) {
        break;
      }
      memoryEntries.delete(oldestKey);
    }
  }

  function checkMemory(
    identifier: string,
    policy: RateLimitConfig,
    degraded: boolean
  ): RateLimitResult {
    const currentTime = now();
    const key = `${policy.name}:${identifier}`;
    const existing = memoryEntries.get(key);

    if (!existing || existing.resetTime <= currentTime) {
      enforceMemoryBound(currentTime);
      const resetTime = currentTime + policy.windowMs;
      memoryEntries.set(key, { count: 1, resetTime });
      return {
        allowed: true,
        backend: "memory",
        degraded,
        remainingRequests: Math.max(0, policy.maxRequests - 1),
        resetTime,
      };
    }

    if (existing.count >= policy.maxRequests) {
      return {
        allowed: false,
        backend: "memory",
        degraded,
        reason: "limit_exceeded",
        remainingRequests: 0,
        resetTime: existing.resetTime,
      };
    }

    existing.count += 1;
    memoryEntries.delete(key);
    memoryEntries.set(key, existing);

    return {
      allowed: true,
      backend: "memory",
      degraded,
      remainingRequests: Math.max(0, policy.maxRequests - existing.count),
      resetTime: existing.resetTime,
    };
  }

  async function check(
    request: NextRequest,
    policy: RateLimitConfig
  ): Promise<RateLimitResult> {
    validatePolicy(policy);

    let identifier: string;
    try {
      identifier = await hashIdentifier(getClientFingerprint(request));
    } catch {
      logger.error("rate_limit.identifier_failed", { policy: policy.name });
      return {
        allowed: false,
        backend: "unavailable",
        degraded: true,
        reason: "dependency_unavailable",
      };
    }

    const redisState = options.redisState ?? resolveRedisState();
    if (redisState === "unconfigured") {
      return checkMemory(identifier, policy, false);
    }

    if (redisState === "invalid") {
      logger.error("rate_limit.redis_configuration_invalid", {
        policy: policy.name,
      });
      return policy.failureMode === "memory"
        ? checkMemory(identifier, policy, true)
        : {
            allowed: false,
            backend: "unavailable",
            degraded: true,
            reason: "dependency_unavailable",
          };
    }

    try {
      const decision = await redisLimit(policy, identifier);
      return {
        allowed: decision.success,
        backend: "redis",
        degraded: false,
        ...(decision.success ? {} : { reason: "limit_exceeded" as const }),
        remainingRequests: Math.max(0, decision.remaining),
        resetTime: decision.reset,
      };
    } catch {
      logger.error("rate_limit.redis_unavailable", { policy: policy.name });
      return policy.failureMode === "memory"
        ? checkMemory(identifier, policy, true)
        : {
            allowed: false,
            backend: "unavailable",
            degraded: true,
            reason: "dependency_unavailable",
          };
    }
  }

  return {
    check,
    getMemoryEntryCount: () => memoryEntries.size,
  };
}

const defaultRateLimitService = createRateLimitService();

export async function checkRateLimitRedis(
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  return defaultRateLimitService.check(request, config);
}

export function isRedisConfigured(): boolean {
  return resolveRedisState() === "configured";
}

export function getRateLimitingMethod(): "redis" | "memory" {
  return isRedisConfigured() ? "redis" : "memory";
}
