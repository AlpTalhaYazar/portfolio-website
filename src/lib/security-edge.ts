/**
 * Edge Runtime Compatible Security Utilities
 *
 * This module contains security functions that are compatible with Next.js Edge Runtime.
 * Functions that need Node.js crypto are in security-server.ts
 */

import { NextRequest } from "next/server";
import {
  RateLimitInfo,
  SecurityEvent,
  RateLimitResult,
  RateLimitConfig,
  ProgressiveBlockInfo,
  BlockInfo,
  SECURITY_CONSTANTS,
} from "@/types";
import { logger } from "@/lib/logger";

// =================================================
// STORAGE INTERFACES (use Redis in production)
// =================================================

// Rate limiting store with progressive blocking
const rateLimitStore = new Map<string, RateLimitInfo>();

// Progressive blocking store for escalating restrictions
const progressiveBlockStore = new Map<string, ProgressiveBlockInfo>();

// =================================================
// PROGRESSIVE RATE LIMITING
// =================================================

/**
 * Enhanced rate limiting with progressive blocking
 * Escalates restrictions based on violation history
 */
// Overload for backwards compatibility (separate parameters)
export function checkRateLimit(
  request: NextRequest,
  windowMs?: number,
  maxRequests?: number
): RateLimitResult;

// Overload for RateLimitConfig object
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): RateLimitResult;

// Implementation
export function checkRateLimit(
  request: NextRequest,
  windowMsOrConfig:
    | number
    | RateLimitConfig = SECURITY_CONSTANTS.DEFAULT_RATE_LIMIT_WINDOW,
  maxRequests: number = SECURITY_CONSTANTS.DEFAULT_MAX_REQUESTS
): RateLimitResult {
  // Handle both parameter styles
  let windowMs: number;
  let maxRequestsResolved: number;

  if (typeof windowMsOrConfig === "object") {
    // Called with RateLimitConfig object
    windowMs = windowMsOrConfig.windowMs;
    maxRequestsResolved = windowMsOrConfig.maxRequests;
  } else {
    // Called with separate parameters (backwards compatibility)
    windowMs = windowMsOrConfig;
    maxRequestsResolved = maxRequests;
  }
  const clientIP = getClientIP(request);
  const now = Date.now();
  const key = `rate_limit:${clientIP}`;

  // Check if client is currently in progressive block
  const blockInfo = checkProgressiveBlock(clientIP, now);
  if (blockInfo.isBlocked) {
    return {
      allowed: false,
      blockInfo,
    };
  }

  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetTime) {
    // Reset or create new rate limit window
    const resetTime = now + windowMs;
    const newInfo: RateLimitInfo = {
      count: 1,
      resetTime,
      windowMs,
    };
    rateLimitStore.set(key, newInfo);
    return {
      allowed: true,
      resetTime,
      remainingRequests: maxRequestsResolved - 1,
      blockInfo: { isBlocked: false, escalationLevel: 0 },
    };
  }

  if (existing.count >= maxRequestsResolved) {
    // Rate limit exceeded - trigger progressive blocking
    triggerProgressiveBlock(clientIP, now);

    return {
      allowed: false,
      resetTime: existing.resetTime,
      remainingRequests: 0,
      blockInfo: checkProgressiveBlock(clientIP, now),
    };
  }

  // Increment counter
  const updatedInfo: RateLimitInfo = {
    ...existing,
    count: existing.count + 1,
  };
  rateLimitStore.set(key, updatedInfo);

  return {
    allowed: true,
    resetTime: existing.resetTime,
    remainingRequests: maxRequestsResolved - updatedInfo.count,
    blockInfo: { isBlocked: false, escalationLevel: 0 },
  };
}

/**
 * Check if client is in progressive block
 */
function checkProgressiveBlock(clientIP: string, now: number): BlockInfo {
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

  // Block expired, clean up if it's been long enough since last violation
  if (now > blockData.lastViolation + SECURITY_CONSTANTS.CLEANUP_INTERVAL) {
    progressiveBlockStore.delete(clientIP);
  }

  return { isBlocked: false, escalationLevel: blockData.escalationLevel };
}

/**
 * Trigger progressive blocking with escalating delays
 */
function triggerProgressiveBlock(clientIP: string, now: number) {
  const existing = progressiveBlockStore.get(clientIP);

  if (!existing) {
    // First violation: 5 minutes
    progressiveBlockStore.set(clientIP, {
      violations: 1,
      lastViolation: now,
      blockUntil: now + SECURITY_CONSTANTS.BLOCK_DURATIONS.LEVEL_1,
      escalationLevel: 1,
    });
    return;
  }

  // Escalate based on violation count with gradual progression
  const violations = existing.violations + 1;
  let blockDuration: number;
  let escalationLevel: number;

  if (violations === SECURITY_CONSTANTS.VIOLATION_THRESHOLDS.LEVEL_2) {
    blockDuration = SECURITY_CONSTANTS.BLOCK_DURATIONS.LEVEL_2; // 10 min
    escalationLevel = 2;
  } else if (violations <= SECURITY_CONSTANTS.VIOLATION_THRESHOLDS.LEVEL_3) {
    blockDuration = SECURITY_CONSTANTS.BLOCK_DURATIONS.LEVEL_3; // 30 min
    escalationLevel = 3;
  } else if (violations <= SECURITY_CONSTANTS.VIOLATION_THRESHOLDS.LEVEL_4) {
    blockDuration = SECURITY_CONSTANTS.BLOCK_DURATIONS.LEVEL_4; // 1 hour
    escalationLevel = 4;
  } else if (violations <= SECURITY_CONSTANTS.VIOLATION_THRESHOLDS.LEVEL_5) {
    blockDuration = SECURITY_CONSTANTS.BLOCK_DURATIONS.LEVEL_5; // 2 hours
    escalationLevel = 5;
  } else {
    blockDuration = SECURITY_CONSTANTS.BLOCK_DURATIONS.LEVEL_6; // 24 hours
    escalationLevel = 6;
  }

  progressiveBlockStore.set(clientIP, {
    violations,
    lastViolation: now,
    blockUntil: now + blockDuration,
    escalationLevel,
  });
}

/**
 * Get client IP address from various headers
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfIP = request.headers.get("cf-connecting-ip"); // Cloudflare

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfIP) {
    return cfIP;
  }

  // Fallback for unknown IP
  return "unknown";
}

/**
 * Enhanced security event logging with severity levels
 */
export function logSecurityEvent(event: SecurityEvent) {
  const securityEvent: SecurityEvent = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
  };

  // Log based on severity using secure logger
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
