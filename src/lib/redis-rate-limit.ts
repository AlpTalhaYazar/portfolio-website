/**
 * Redis-backed Rate Limiting with Upstash
 *
 * This module provides distributed rate limiting using Upstash Redis.
 * Falls back to in-memory rate limiting if Redis is not configured.
 *
 * Environment Variables Required:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";
import type {
  RateLimitConfig,
  RateLimitResult,
  BlockInfo,
  SecurityEvent,
} from "@/types";
import { logger } from "@/lib/logger";

// =================================================
// REDIS CLIENT INITIALIZATION
// =================================================

let redis: Redis | null = null;
let rateLimiter: Ratelimit | null = null;
let isRedisAvailable = false;

/**
 * Initialize Redis client if environment variables are present
 */
function initializeRedis(): boolean {
  if (redis !== null) {
    return isRedisAvailable;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    logger.dev.warn("Redis not configured - using in-memory rate limiting");
    isRedisAvailable = false;
    return false;
  }

  try {
    redis = new Redis({
      url,
      token,
    });

    // Create a default rate limiter instance
    rateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "10 m"), // Default: 20 requests per 10 minutes
      analytics: true, // Enable analytics
      prefix: "ratelimit:",
    });

    isRedisAvailable = true;
    logger.dev.log("Redis rate limiting initialized successfully");
    return true;
  } catch (error) {
    logger.error("Failed to initialize Redis:", error);
    isRedisAvailable = false;
    return false;
  }
}

// =================================================
// IN-MEMORY FALLBACK STORES
// =================================================

interface RateLimitInfo {
  count: number;
  resetTime: number;
  windowMs: number;
}

interface ProgressiveBlockInfo {
  violations: number;
  lastViolation: number;
  blockUntil: number;
  escalationLevel: number;
}

const rateLimitStore = new Map<string, RateLimitInfo>();
const progressiveBlockStore = new Map<string, ProgressiveBlockInfo>();

// Block duration constants (in ms)
const BLOCK_DURATIONS = {
  LEVEL_1: 5 * 60 * 1000, // 5 minutes
  LEVEL_2: 10 * 60 * 1000, // 10 minutes
  LEVEL_3: 30 * 60 * 1000, // 30 minutes
  LEVEL_4: 60 * 60 * 1000, // 1 hour
  LEVEL_5: 2 * 60 * 60 * 1000, // 2 hours
  LEVEL_6: 24 * 60 * 60 * 1000, // 24 hours
};

// =================================================
// RATE LIMITING FUNCTIONS
// =================================================

/**
 * Get client IP address from request headers
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfIP = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfIP) {
    return cfIP;
  }

  return "unknown";
}

/**
 * Check rate limit using Redis (with fallback to in-memory)
 */
export async function checkRateLimitRedis(
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const clientIP = getClientIP(request);
  const identifier = `${clientIP}:${config.windowMs}:${config.maxRequests}`;

  // Try Redis first
  if (initializeRedis() && rateLimiter) {
    return checkRateLimitWithRedis(identifier, config);
  }

  // Fallback to in-memory
  return checkRateLimitInMemory(clientIP, config);
}

/**
 * Redis-backed rate limiting with Upstash Ratelimit
 */
async function checkRateLimitWithRedis(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  if (!redis) {
    return {
      allowed: true,
      remainingRequests: config.maxRequests,
      blockInfo: { isBlocked: false, escalationLevel: 0 },
    };
  }

  try {
    // Create a custom rate limiter for this specific config
    const customLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        config.maxRequests,
        `${Math.floor(config.windowMs / 1000)} s`
      ),
      prefix: `ratelimit:${config.windowMs}:`,
    });

    const { success, limit: _limit, remaining, reset } =
      await customLimiter.limit(identifier);

    if (!success) {
      // Record progressive block in Redis
      await recordProgressiveBlock(identifier);

      const blockInfo = await getProgressiveBlockInfo(identifier);

      return {
        allowed: false,
        resetTime: reset,
        remainingRequests: remaining,
        blockInfo,
      };
    }

    return {
      allowed: true,
      resetTime: reset,
      remainingRequests: remaining,
      blockInfo: { isBlocked: false, escalationLevel: 0 },
    };
  } catch (error) {
    logger.error("Redis rate limit check failed, falling back:", error);
    // Fallback to allowing request on Redis error
    return {
      allowed: true,
      remainingRequests: config.maxRequests,
      blockInfo: { isBlocked: false, escalationLevel: 0 },
    };
  }
}

/**
 * Record progressive blocking in Redis
 */
async function recordProgressiveBlock(identifier: string): Promise<void> {
  if (!redis) return;

  const key = `progressive_block:${identifier}`;

  try {
    const current = await redis.get<ProgressiveBlockInfo>(key);
    const now = Date.now();

    if (!current) {
      await redis.setex(key, 86400, {
        // 24 hour TTL
        violations: 1,
        lastViolation: now,
        blockUntil: now + BLOCK_DURATIONS.LEVEL_1,
        escalationLevel: 1,
      });
      return;
    }

    const violations = current.violations + 1;
    let blockDuration: number;
    let escalationLevel: number;

    if (violations <= 2) {
      blockDuration = BLOCK_DURATIONS.LEVEL_2;
      escalationLevel = 2;
    } else if (violations <= 3) {
      blockDuration = BLOCK_DURATIONS.LEVEL_3;
      escalationLevel = 3;
    } else if (violations <= 5) {
      blockDuration = BLOCK_DURATIONS.LEVEL_4;
      escalationLevel = 4;
    } else if (violations <= 8) {
      blockDuration = BLOCK_DURATIONS.LEVEL_5;
      escalationLevel = 5;
    } else {
      blockDuration = BLOCK_DURATIONS.LEVEL_6;
      escalationLevel = 6;
    }

    await redis.setex(key, 86400, {
      violations,
      lastViolation: now,
      blockUntil: now + blockDuration,
      escalationLevel,
    });
  } catch (error) {
    logger.error("Failed to record progressive block:", error);
  }
}

/**
 * Get progressive block info from Redis
 */
async function getProgressiveBlockInfo(identifier: string): Promise<BlockInfo> {
  if (!redis) {
    return { isBlocked: false, escalationLevel: 0 };
  }

  const key = `progressive_block:${identifier}`;

  try {
    const data = await redis.get<ProgressiveBlockInfo>(key);

    if (!data) {
      return { isBlocked: false, escalationLevel: 0 };
    }

    const now = Date.now();
    if (now < data.blockUntil) {
      return {
        isBlocked: true,
        blockUntil: data.blockUntil,
        escalationLevel: data.escalationLevel,
      };
    }

    return {
      isBlocked: false,
      escalationLevel: data.escalationLevel,
    };
  } catch (error) {
    logger.error("Failed to get progressive block info:", error);
    return { isBlocked: false, escalationLevel: 0 };
  }
}

/**
 * In-memory fallback rate limiting
 */
function checkRateLimitInMemory(
  clientIP: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = `rate_limit:${clientIP}`;

  // Check progressive block
  const blockInfo = checkProgressiveBlockInMemory(clientIP, now);
  if (blockInfo.isBlocked) {
    return { allowed: false, blockInfo };
  }

  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitStore.set(key, {
      count: 1,
      resetTime,
      windowMs: config.windowMs,
    });
    return {
      allowed: true,
      resetTime,
      remainingRequests: config.maxRequests - 1,
      blockInfo: { isBlocked: false, escalationLevel: 0 },
    };
  }

  if (existing.count >= config.maxRequests) {
    triggerProgressiveBlockInMemory(clientIP, now);
    return {
      allowed: false,
      resetTime: existing.resetTime,
      remainingRequests: 0,
      blockInfo: checkProgressiveBlockInMemory(clientIP, now),
    };
  }

  existing.count++;
  rateLimitStore.set(key, existing);

  return {
    allowed: true,
    resetTime: existing.resetTime,
    remainingRequests: config.maxRequests - existing.count,
    blockInfo: { isBlocked: false, escalationLevel: 0 },
  };
}

function checkProgressiveBlockInMemory(
  clientIP: string,
  now: number
): BlockInfo {
  const blockData = progressiveBlockStore.get(clientIP);

  if (!blockData) {
    return { isBlocked: false, escalationLevel: 0 };
  }

  if (now < blockData.blockUntil) {
    return {
      isBlocked: true,
      blockUntil: blockData.blockUntil,
      escalationLevel: blockData.escalationLevel,
    };
  }

  return { isBlocked: false, escalationLevel: blockData.escalationLevel };
}

function triggerProgressiveBlockInMemory(clientIP: string, now: number): void {
  const existing = progressiveBlockStore.get(clientIP);

  if (!existing) {
    progressiveBlockStore.set(clientIP, {
      violations: 1,
      lastViolation: now,
      blockUntil: now + BLOCK_DURATIONS.LEVEL_1,
      escalationLevel: 1,
    });
    return;
  }

  const violations = existing.violations + 1;
  let blockDuration: number;
  let escalationLevel: number;

  if (violations <= 2) {
    blockDuration = BLOCK_DURATIONS.LEVEL_2;
    escalationLevel = 2;
  } else if (violations <= 3) {
    blockDuration = BLOCK_DURATIONS.LEVEL_3;
    escalationLevel = 3;
  } else if (violations <= 5) {
    blockDuration = BLOCK_DURATIONS.LEVEL_4;
    escalationLevel = 4;
  } else if (violations <= 8) {
    blockDuration = BLOCK_DURATIONS.LEVEL_5;
    escalationLevel = 5;
  } else {
    blockDuration = BLOCK_DURATIONS.LEVEL_6;
    escalationLevel = 6;
  }

  progressiveBlockStore.set(clientIP, {
    violations,
    lastViolation: now,
    blockUntil: now + blockDuration,
    escalationLevel,
  });
}

// =================================================
// SECURITY EVENT LOGGING
// =================================================

/**
 * Log security events with severity levels
 */
export function logSecurityEvent(event: SecurityEvent): void {
  const securityEvent: SecurityEvent = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
  };

  switch (event.severity) {
    case "critical":
      logger.error(`[SECURITY CRITICAL] ${event.type}`, securityEvent);
      break;
    case "high":
      logger.error(`[SECURITY HIGH] ${event.type}`, securityEvent);
      break;
    case "medium":
      logger.warn(`[SECURITY MEDIUM] ${event.type}`, securityEvent);
      break;
    case "low":
      logger.security(`[SECURITY LOW] ${event.type}`, securityEvent);
      break;
    default:
      logger.warn(`[SECURITY] ${event.type}`, securityEvent);
  }
}

// =================================================
// UTILITY EXPORTS
// =================================================

/**
 * Check if Redis is available
 */
export function isRedisConfigured(): boolean {
  return initializeRedis();
}

/**
 * Get rate limiting method being used
 */
export function getRateLimitingMethod(): "redis" | "memory" {
  return initializeRedis() ? "redis" : "memory";
}
