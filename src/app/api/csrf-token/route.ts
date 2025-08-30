import { NextRequest, NextResponse } from "next/server";
import {
  generateSessionId,
  generateCSRFToken,
  refreshCSRFToken,
  getClientIP,
  verifyOrigin,
  logSecurityEvent,
  cleanupExpiredTokens,
} from "@/lib/security";
import { logger } from "@/lib/logger";

/**
 * CSRF Token API Endpoint
 * Provides secure CSRF tokens for form submissions
 */
export async function GET(request: NextRequest) {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "unknown";

  logger.security("[CSRF API] Request received", {
    clientIP,
    origin: request.headers.get("origin"),
    referer: request.headers.get("referer"),
  });

  try {
    // 1. Origin verification
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "https://www.alptalha.dev",
    ];

    const originVerified = verifyOrigin(request, allowedOrigins);
    logger.dev.log("[CSRF API] Origin verification result:", originVerified);

    if (!originVerified) {
      logger.error("[CSRF API] Origin verification failed");
      logSecurityEvent({
        type: "origin_violation",
        ip: clientIP,
        userAgent,
        severity: "high",
        details: {
          endpoint: "/api/csrf-token",
          origin: request.headers.get("origin"),
          referer: request.headers.get("referer"),
        },
      });
      return NextResponse.json(
        { error: "Unauthorized request origin" },
        { status: 403 }
      );
    }

    // 2. Clean up expired tokens periodically
    cleanupExpiredTokens();

    // 3. Check for existing session ID from headers
    const existingSessionId = request.headers.get("x-session-id");
    logger.security("[CSRF API] Session check", {
      hasExistingSession: !!existingSessionId,
      sessionId: existingSessionId,
    });

    let csrfToken;
    let sessionId;

    if (existingSessionId) {
      logger.dev.log("[CSRF API] Attempting to refresh existing token");
      // Try to refresh existing token
      const refreshedToken = refreshCSRFToken(existingSessionId);
      if (refreshedToken) {
        logger.dev.log("[CSRF API] Token refreshed successfully");
        csrfToken = refreshedToken;
        sessionId = existingSessionId;
      } else {
        logger.dev.log(
          "[CSRF API] Token refresh failed, generating new session"
        );
        // Generate new session if refresh failed
        sessionId = generateSessionId(request);
        csrfToken = generateCSRFToken(sessionId);
      }
    } else {
      logger.dev.log("[CSRF API] No existing session, generating new session");
      // Generate new session and token
      sessionId = generateSessionId(request);
      csrfToken = generateCSRFToken(sessionId);
    }

    logger.security("[CSRF API] Token generated", {
      sessionId,
      token: csrfToken.token,
      tokenLength: csrfToken.token.length,
      expires: new Date(csrfToken.expires),
    });

    // 4. Log successful token generation (low severity)
    logSecurityEvent({
      type: "csrf_violation", // Reusing type for token generation
      ip: clientIP,
      userAgent,
      severity: "low",
      details: {
        action: "token_generated",
        sessionId,
        isRefresh: !!existingSessionId,
      },
    });

    const response = {
      success: true,
      token: csrfToken.token,
      sessionId: csrfToken.sessionId,
      expires: csrfToken.expires,
      expiresIn: Math.floor((csrfToken.expires - Date.now()) / 1000), // seconds
    };

    logger.security("[CSRF API] Sending successful response", {
      success: response.success,
      token: response.token,
      sessionId: response.sessionId,
      tokenLength: response.token.length,
      expiresIn: response.expiresIn,
    });

    return NextResponse.json(response);
  } catch (error) {
    logger.error("Error generating CSRF token:", error);

    logSecurityEvent({
      type: "csrf_violation",
      ip: clientIP,
      userAgent,
      severity: "medium",
      details: {
        action: "token_generation_failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });

    return NextResponse.json(
      {
        error: "Failed to generate security token. Please try again.",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
