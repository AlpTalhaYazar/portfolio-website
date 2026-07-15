import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimitRedis,
} from "@/lib/redis-rate-limit";
import { logSecurityEvent } from "@/lib/security";
import { buildCSPHeader } from "@/lib/csp";
import { buildRequestContextHeaders } from "@/lib/request-context";
import type { RateLimitConfig } from "@/types";

// Rate limiting configuration per endpoint
const RATE_LIMIT_CONFIG: Record<string, RateLimitConfig> = {
  "/api/contact/": {
    name: "contact",
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    failureMode: "closed",
  },
  "/api/csrf-token/": {
    name: "csrf-token",
    windowMs: 5 * 60 * 1000,
    maxRequests: 10,
    failureMode: "memory",
  },
  "/api/health/": {
    name: "health",
    windowMs: 1 * 60 * 1000,
    maxRequests: 30,
    failureMode: "memory",
  },
  // Default for other API routes
  "/api/": {
    name: "api-default",
    windowMs: 10 * 60 * 1000,
    maxRequests: 20,
    failureMode: "memory",
  },
};

function isSensitivePath(pathname: string): boolean {
  let decodedPathname: string;

  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    return true;
  }

  const normalizedPathname =
    decodedPathname.replace(/\/{2,}/g, "/").replace(/\/+$/, "") || "/";
  const normalizedLowerPathname = normalizedPathname.toLowerCase();
  const segments = normalizedLowerPathname.split("/").filter(Boolean);

  const containsSensitiveDotfile = segments.some(
    (segment) =>
      segment === ".git" ||
      segment === ".env" ||
      segment.startsWith(".env.")
  );

  return (
    containsSensitiveDotfile ||
    normalizedLowerPathname === "/admin" ||
    normalizedLowerPathname.startsWith("/admin/")
  );
}

/**
 * Generate a cryptographically secure nonce using Web Crypto API (Edge compatible)
 */
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

/**
 * Apply rate limiting based on endpoint configuration
 * Uses Redis when available, falls back to in-memory
 */
async function applyRateLimit(
  request: NextRequest,
  pathname: string
): Promise<NextResponse | null> {
  // Find the most specific rate limit config for this path
  let rateLimitConfig: RateLimitConfig = RATE_LIMIT_CONFIG["/api/"]; // default
  for (const [path, pathConfig] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (pathname.startsWith(path) && path !== "/api/") {
      rateLimitConfig = pathConfig;
      break;
    }
  }

  // Use Redis-backed rate limiting (with fallback to in-memory)
  const rateLimit = await checkRateLimitRedis(request, rateLimitConfig);

  if (!rateLimit.allowed) {
    if (rateLimit.reason === "dependency_unavailable") {
      return NextResponse.json(
        {
          success: false,
          code: "rate_limit_unavailable",
          error: "Request protection is temporarily unavailable.",
        },
        {
          status: 503,
          headers: {
            "Cache-Control": "no-store",
            "Retry-After": "5",
          },
        }
      );
    }

    logSecurityEvent({
      type: "rate_limit",
      ip: "redacted",
      severity: "medium",
      timestamp: new Date().toISOString(),
      details: {
        endpoint: pathname,
        windowMs: rateLimitConfig.windowMs,
        maxRequests: rateLimitConfig.maxRequests,
        method: rateLimit.backend,
        degraded: rateLimit.degraded,
      },
    });

    const retryAfter = rateLimit.resetTime
      ? Math.max(1, Math.ceil((rateLimit.resetTime - Date.now()) / 1000))
      : Math.max(1, Math.ceil(rateLimitConfig.windowMs / 1000));

    return NextResponse.json(
      {
        success: false,
        code: "rate_limit_exceeded",
        error: "Too many requests. Please try again later.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": rateLimitConfig.maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": rateLimit.resetTime?.toString() || "",
        },
      }
    );
  }

  return null; // No rate limit applied, continue to next proxy/route
}

/**
 * Async proxy with Redis-backed rate limiting and nonce-based CSP
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/tr" || pathname.startsWith("/tr/")) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(canonicalUrl, 308);
  }

  if (isSensitivePath(pathname)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Apply rate limiting to API routes (async for Redis support)
  if (pathname.startsWith("/api/")) {
    const rateLimitResult = await applyRateLimit(request, pathname);
    if (rateLimitResult) {
      return rateLimitResult; // Return rate limit response
    }
  }

  // Generate nonce for CSP
  const nonce = generateNonce();

  const requestHeaders = buildRequestContextHeaders(
    request.headers,
    pathname,
    nonce
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Add security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");

  // Add Strict Transport Security in production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Add Permissions Policy
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), fullscreen=(self), autoplay=(self)"
  );

  // Add nonce-based Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    buildCSPHeader({
      nonce,
      upgradeInsecureRequests: request.nextUrl.protocol === "https:",
    })
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
