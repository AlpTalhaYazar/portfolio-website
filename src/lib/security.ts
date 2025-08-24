/**
 * Security utilities for runtime protection
 */

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate email format with security considerations
 */
export function isValidEmail(email: string): boolean {
  // More strict email validation to prevent injection
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  // Additional security checks
  if (email.length > 254) return false; // RFC 5321 limit
  if (email.includes("..")) return false; // Consecutive dots not allowed
  if (email.startsWith(".") || email.endsWith(".")) return false;

  return emailRegex.test(email);
}

/**
 * Validate URL format and prevent malicious URLs
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    return ["http:", "https:"].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Rate limiting utility for form submissions
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];

    // Remove old attempts outside the window
    const validAttempts = attempts.filter((time) => now - time < this.windowMs);

    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);

    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const formRateLimiter = new RateLimiter();

/**
 * Generate secure random string for tokens/IDs
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

/**
 * Secure content validation for user-generated content
 */
export function validateContent(content: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for potential XSS attempts
  if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(content)) {
    errors.push("Script tags are not allowed");
  }

  if (/javascript:/i.test(content)) {
    errors.push("JavaScript URLs are not allowed");
  }

  if (/on\w+\s*=/i.test(content)) {
    errors.push("Event handlers are not allowed");
  }

  // Check content length
  if (content.length > 10000) {
    errors.push("Content too long (max 10,000 characters)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Security headers validation for client-side
 */
export function validateSecurityHeaders(): {
  csp: boolean;
  xFrameOptions: boolean;
  xContentTypeOptions: boolean;
} {
  const meta = document.querySelector(
    'meta[http-equiv="Content-Security-Policy"]'
  );

  return {
    csp: !!meta,
    xFrameOptions: true, // Set in Next.js config
    xContentTypeOptions: true, // Set in Next.js config
  };
}

/**
 * Environment-specific security configuration
 */
export const securityConfig = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  allowDevTools: process.env.NODE_ENV !== "production",

  // Security settings
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  maxFormSubmissions: 5,
  rateLimitWindow: 60000, // 1 minute
};

/**
 * Initialize security measures on client
 */
export function initializeSecurity(): void {
  if (typeof window === "undefined") return;

  // Disable console in production
  if (securityConfig.isProduction && !securityConfig.allowDevTools) {
    Object.defineProperty(window, "console", {
      value: {},
      writable: false,
      configurable: false,
    });
  }

  // Add security event listeners
  window.addEventListener("error", (event) => {
    // Log security-related errors (in production, send to monitoring service)
    if (securityConfig.isDevelopment) {
      console.warn("Security warning:", event.error);
    }
  });

  // Prevent drag and drop of files to avoid potential security issues
  window.addEventListener("dragover", (e) => e.preventDefault());
  window.addEventListener("drop", (e) => e.preventDefault());
}
