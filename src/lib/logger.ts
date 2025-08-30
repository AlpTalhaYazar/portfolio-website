/**
 * Secure development logging utility
 * Prevents sensitive information from being logged in production
 */

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  /**
   * Development-only logging
   */
  dev: {
    log: (...args: unknown[]) => {
      if (isDevelopment) {
        console.log(...args);
      }
    },
    warn: (...args: unknown[]) => {
      if (isDevelopment) {
        console.warn(...args);
      }
    },
    error: (...args: unknown[]) => {
      if (isDevelopment) {
        console.error(...args);
      }
    },
  },

  /**
   * Production-safe logging (always logs but sanitizes sensitive data)
   */
  info: (...args: unknown[]) => {
    console.log(...args);
  },
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  },

  /**
   * Security-focused logging that sanitizes sensitive information
   */
  security: (message: string, data?: Record<string, unknown>) => {
    if (isDevelopment) {
      console.log(`[SECURITY DEV] ${message}`, data);
    } else {
      // In production, log only non-sensitive information
      const sanitizedData = data ? sanitizeLogData(data) : undefined;
      console.log(`[SECURITY] ${message}`, sanitizedData);
    }
  },
};

/**
 * Sanitize log data to remove sensitive information in production
 */
function sanitizeLogData(
  data: Record<string, unknown>
): Record<string, unknown> {
  const sensitiveKeys = [
    "token",
    "sessionId",
    "password",
    "secret",
    "key",
    "auth",
    "csrf",
    "session",
    "cookie",
    "header",
    "authorization",
  ];

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveKeys.some((sensitiveKey) =>
      lowerKey.includes(sensitiveKey)
    );

    if (isSensitive) {
      if (typeof value === "string") {
        sanitized[key] =
          value.length > 0 ? `[REDACTED:${value.length}chars]` : "[EMPTY]";
      } else {
        sanitized[key] = "[REDACTED]";
      }
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export default logger;
