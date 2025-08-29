import { NextRequest } from "next/server";
import crypto from "crypto";

// Rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// CSRF token store (use Redis in production)
const csrfTokenStore = new Map<string, { token: string; expires: number }>();

/**
 * Rate limiting middleware
 * Limits requests per IP address
 */
export function checkRateLimit(
  request: NextRequest,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  maxRequests: number = 5 // max 5 requests per window
): { allowed: boolean; resetTime?: number } {
  const clientIP = getClientIP(request);
  const now = Date.now();

  const key = `rate_limit:${clientIP}`;
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetTime) {
    // Reset or create new rate limit window
    const resetTime = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return { allowed: true, resetTime };
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, resetTime: existing.resetTime };
  }

  // Increment counter
  rateLimitStore.set(key, { ...existing, count: existing.count + 1 });
  return { allowed: true, resetTime: existing.resetTime };
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
 * Generate CSRF token for forms
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string, sessionId: string): boolean {
  const stored = csrfTokenStore.get(sessionId);
  if (!stored || stored.expires < Date.now()) {
    return false;
  }
  return stored.token === token;
}

/**
 * Store CSRF token for session
 */
export function storeCSRFToken(token: string, sessionId: string): void {
  const expires = Date.now() + 60 * 60 * 1000; // 1 hour
  csrfTokenStore.set(sessionId, { token, expires });
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

  if (!origin && !referer) {
    return false; // Require either origin or referer
  }

  const requestOrigin = origin || (referer ? new URL(referer).origin : "");
  return allowedOrigins.includes(requestOrigin);
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
 * Log security events
 */
export function logSecurityEvent(event: {
  type: "rate_limit" | "csrf_violation" | "spam_detected" | "origin_violation";
  ip: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}) {
  console.warn(`[SECURITY] ${event.type}:`, {
    timestamp: new Date().toISOString(),
    ip: event.ip,
    userAgent: event.userAgent,
    details: event.details,
  });

  // In production, send to monitoring service
  // Example: Sentry, DataDog, CloudWatch, etc.
}
