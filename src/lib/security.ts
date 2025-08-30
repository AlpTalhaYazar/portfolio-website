import { NextRequest } from "next/server";
import crypto from "crypto";
import {
  CSRFToken,
  RateLimitInfo,
  SecurityEvent,
  RateLimitResult,
} from "@/types";
import { logger } from "@/lib/logger";

// =================================================
// STORAGE INTERFACES (use Redis in production)
// =================================================

// Rate limiting store with progressive blocking
const rateLimitStore = new Map<string, RateLimitInfo>();

// Progressive blocking store for escalating restrictions
const progressiveBlockStore = new Map<
  string,
  {
    violations: number;
    lastViolation: number;
    blockUntil: number;
    escalationLevel: number;
  }
>();

// CSRF token store with session management
const csrfTokenStore = new Map<string, CSRFToken>();

// =================================================
// PROGRESSIVE RATE LIMITING
// =================================================

/**
 * Enhanced rate limiting with progressive blocking
 * Escalates restrictions based on violation history
 */
export function checkRateLimit(
  request: NextRequest,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  maxRequests: number = 5 // max 5 requests per window
): RateLimitResult {
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
      remainingRequests: maxRequests - 1,
      blockInfo: { isBlocked: false, escalationLevel: 0 },
    };
  }

  if (existing.count >= maxRequests) {
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
    remainingRequests: maxRequests - updatedInfo.count,
    blockInfo: { isBlocked: false, escalationLevel: 0 },
  };
}

/**
 * Check if client is in progressive block
 */
function checkProgressiveBlock(clientIP: string, now: number) {
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
  if (now > blockData.lastViolation + 24 * 60 * 60 * 1000) {
    // 24 hours
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
      blockUntil: now + 5 * 60 * 1000, // 5 minutes
      escalationLevel: 1,
    });
    return;
  }

  // Escalate based on violation count
  const violations = existing.violations + 1;
  let blockDuration: number;
  let escalationLevel: number;

  if (violations <= 2) {
    blockDuration = 5 * 60 * 1000; // 5 minutes
    escalationLevel = 1;
  } else if (violations <= 5) {
    blockDuration = 30 * 60 * 1000; // 30 minutes
    escalationLevel = 2;
  } else if (violations <= 10) {
    blockDuration = 2 * 60 * 60 * 1000; // 2 hours
    escalationLevel = 3;
  } else {
    blockDuration = 24 * 60 * 60 * 1000; // 24 hours
    escalationLevel = 4;
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

// =================================================
// CSRF PROTECTION
// =================================================

/**
 * Generate session ID for CSRF token management
 */
export function generateSessionId(request: NextRequest): string {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "unknown";
  const timestamp = Date.now();

  return crypto
    .createHash("sha256")
    .update(`${clientIP}-${userAgent}-${timestamp}`)
    .digest("hex")
    .substring(0, 32);
}

/**
 * Generate CSRF token for forms with session tracking
 */
export function generateCSRFToken(sessionId: string): CSRFToken {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 60 * 60 * 1000; // 1 hour

  const csrfToken: CSRFToken = {
    token,
    expires,
    sessionId,
  };

  csrfTokenStore.set(sessionId, csrfToken);
  return csrfToken;
}

/**
 * Verify CSRF token with enhanced security checks
 */
export function verifyCSRFToken(
  token: string,
  sessionId: string,
  _request?: NextRequest
): { valid: boolean; reason?: string } {
  if (!token || !sessionId) {
    return { valid: false, reason: "missing_token_or_session" };
  }

  const stored = csrfTokenStore.get(sessionId);
  if (!stored) {
    return { valid: false, reason: "invalid_session" };
  }

  if (stored.expires < Date.now()) {
    // Clean up expired token
    csrfTokenStore.delete(sessionId);
    return { valid: false, reason: "token_expired" };
  }

  if (stored.token !== token) {
    return { valid: false, reason: "token_mismatch" };
  }

  // Additional security: verify session integrity
  if (stored.sessionId !== sessionId) {
    return { valid: false, reason: "session_mismatch" };
  }

  return { valid: true };
}

/**
 * Clean up expired CSRF tokens
 */
export function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const [sessionId, token] of csrfTokenStore.entries()) {
    if (token.expires < now) {
      csrfTokenStore.delete(sessionId);
    }
  }
}

/**
 * Refresh CSRF token for long-lived sessions
 */
export function refreshCSRFToken(sessionId: string): CSRFToken | null {
  const existing = csrfTokenStore.get(sessionId);
  if (!existing) {
    return null;
  }

  // Only refresh if token is still valid but close to expiring
  const now = Date.now();
  const timeUntilExpiry = existing.expires - now;
  const refreshThreshold = 5 * 60 * 1000; // 5 minutes (matches PR description)

  if (timeUntilExpiry < refreshThreshold) {
    return generateCSRFToken(sessionId);
  }

  return existing;
}

/**
 * Check if request is from same origin
 */
export function verifyOrigin(
  request: NextRequest,
  allowedOrigins: string[]
): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const isDevelopment = process.env.NODE_ENV === "development";

  // In development, be more lenient with origin checking
  if (isDevelopment) {
    // If no origin/referer headers, allow it in development
    if (!origin && !referer) {
      logger.dev.log(
        "[DEV] No origin/referer headers, allowing request in development"
      );
      return true;
    }

    // Check if it's from localhost (any port)
    const requestOrigin = origin || (referer ? new URL(referer).origin : "");
    if (
      requestOrigin.includes("localhost") ||
      requestOrigin.includes("127.0.0.1")
    ) {
      logger.dev.log(
        "[DEV] Localhost request detected, allowing:",
        requestOrigin
      );
      return true;
    }
  }

  // Production: strict origin checking
  if (!origin && !referer) {
    logger.dev.log("Origin verification failed: no origin or referer header");
    return false;
  }

  const requestOrigin = origin || (referer ? new URL(referer).origin : "");
  const isAllowed = allowedOrigins.includes(requestOrigin);

  if (!isAllowed) {
    logger.security("Origin verification failed", {
      requestOrigin,
      allowedOrigins,
      origin,
      referer,
    });
  }

  return isAllowed;
}

/**
 * Validate honeypot field (invisible to users, should be empty)
 */
export function validateHoneypot(
  honeypotValue: string | null | undefined
): boolean {
  return !honeypotValue || honeypotValue.trim() === "";
}

/**
 * Clean and validate input data
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .substring(0, 5000); // Limit length
}

/**
 * Check for suspicious patterns in form data
 */
export function detectSpam(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): boolean {
  const { name, subject, message } = data;

  // Check for common spam patterns
  const spamKeywords = [
    "viagra",
    "casino",
    "bitcoin",
    "crypto",
    "investment",
    "loan",
    "debt",
    "credit",
    "mortgage",
    "insurance",
    "seo services",
    "web design",
    "marketing services",
  ];

  const content = `${name} ${subject} ${message}`.toLowerCase();

  // Check for spam keywords
  if (spamKeywords.some((keyword) => content.includes(keyword))) {
    return true;
  }

  // Check for excessive links
  const linkCount = (content.match(/https?:\/\//g) || []).length;
  if (linkCount > 2) {
    return true;
  }

  // Check for repeated characters (typical spam pattern)
  if (/(.)\1{10,}/.test(content)) {
    return true;
  }

  // Check for all caps message (typical spam)
  if (message.length > 50 && message === message.toUpperCase()) {
    return true;
  }

  return false;
}

/**
 * Enhanced security event logging with severity levels
 */
export function logSecurityEvent(event: Omit<SecurityEvent, "timestamp">) {
  const securityEvent: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  // Log based on severity
  switch (event.severity) {
    case "critical":
      console.error(`[SECURITY CRITICAL] ${event.type}:`, securityEvent);
      break;
    case "high":
      console.error(`[SECURITY HIGH] ${event.type}:`, securityEvent);
      break;
    case "medium":
      console.warn(`[SECURITY MEDIUM] ${event.type}:`, securityEvent);
      break;
    case "low":
      logger.info(`[SECURITY LOW] ${event.type}:`, securityEvent);
      break;
    default:
      console.warn(`[SECURITY] ${event.type}:`, securityEvent);
  }

  // In production, send to monitoring service based on severity
  // Critical/High -> Immediate alerts (PagerDuty, Slack)
  // Medium -> Monitoring dashboard (DataDog, New Relic)
  // Low -> Log aggregation (CloudWatch, Splunk)
}

/**
 * Get detailed security metrics for monitoring
 */
export function getSecurityMetrics() {
  return {
    rateLimitStore: {
      activeEntries: rateLimitStore.size,
      entries: Array.from(rateLimitStore.entries()).map(([key, value]) => ({
        key,
        count: value.count,
        resetTime: new Date(value.resetTime).toISOString(),
      })),
    },
    progressiveBlockStore: {
      blockedIPs: progressiveBlockStore.size,
      entries: Array.from(progressiveBlockStore.entries()).map(
        ([key, value]) => ({
          ip: key,
          violations: value.violations,
          escalationLevel: value.escalationLevel,
          blockUntil: new Date(value.blockUntil).toISOString(),
        })
      ),
    },
    csrfTokenStore: {
      activeSessions: csrfTokenStore.size,
      validTokens: Array.from(csrfTokenStore.values()).filter(
        (token) => token.expires > Date.now()
      ).length,
    },
  };
}
