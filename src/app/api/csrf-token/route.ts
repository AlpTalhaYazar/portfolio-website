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

/**
 * CSRF Token API Endpoint
 * Provides secure CSRF tokens for form submissions
 */
export async function GET(request: NextRequest) {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "unknown";

  try {
    // 1. Origin verification
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "https://www.alptalha.dev",
    ];

    if (!verifyOrigin(request, allowedOrigins)) {
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

    let csrfToken;
    let sessionId;

    if (existingSessionId) {
      // Try to refresh existing token
      const refreshedToken = refreshCSRFToken(existingSessionId);
      if (refreshedToken) {
        csrfToken = refreshedToken;
        sessionId = existingSessionId;
      } else {
        // Generate new session if refresh failed
        sessionId = generateSessionId(request);
        csrfToken = generateCSRFToken(sessionId);
      }
    } else {
      // Generate new session and token
      sessionId = generateSessionId(request);
      csrfToken = generateCSRFToken(sessionId);
    }

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

    return NextResponse.json({
      success: true,
      token: csrfToken.token,
      sessionId: csrfToken.sessionId,
      expires: csrfToken.expires,
      expiresIn: Math.floor((csrfToken.expires - Date.now()) / 1000), // seconds
    });
  } catch (error) {
    console.error("Error generating CSRF token:", error);

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
