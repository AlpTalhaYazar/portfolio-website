import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIP, logSecurityEvent } from "@/lib/security";
import type { RateLimitConfig } from "@/types";

// Rate limiting configuration per endpoint
const RATE_LIMIT_CONFIG: Record<string, RateLimitConfig> = {
  "/api/contact/": { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 requests per 15 minutes
  "/api/csrf-token/": { windowMs: 5 * 60 * 1000, maxRequests: 10 }, // 10 requests per 5 minutes
  // Default for other API routes
  "/api/": { windowMs: 10 * 60 * 1000, maxRequests: 20 }, // 20 requests per 10 minutes
};

const SENSITIVE_PATHS = [
  "/.env",
  "/admin",
  "/.git",
  "/robots.txt",
  "/sitemap.xml",
];

/**
 * Apply rate limiting based on endpoint configuration
 */
function applyRateLimit(
  request: NextRequest,
  pathname: string
): NextResponse | null {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "unknown";

  // Find the most specific rate limit config for this path
  let rateLimitConfig: RateLimitConfig = RATE_LIMIT_CONFIG["/api/"]; // default
  for (const [path, pathConfig] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (pathname.startsWith(path) && path !== "/api/") {
      rateLimitConfig = pathConfig;
      break;
    }
  }

  const rateLimit = checkRateLimit(request, rateLimitConfig);

  if (!rateLimit.allowed) {
    const severity =
      (rateLimit.blockInfo?.escalationLevel ?? 0) >= 3 ? "high" : "medium";

    logSecurityEvent({
      type: "rate_limit",
      ip: clientIP,
      userAgent,
      severity,
      timestamp: new Date().toISOString(),
      details: {
        endpoint: pathname,
        escalationLevel: rateLimit.blockInfo?.escalationLevel,
        blockUntil: rateLimit.blockInfo?.blockUntil,
        windowMs: rateLimitConfig.windowMs,
        maxRequests: rateLimitConfig.maxRequests,
      },
    });

    const retryAfter = rateLimit.resetTime
      ? Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
      : rateLimit.blockInfo?.blockUntil
      ? Math.ceil((rateLimit.blockInfo.blockUntil - Date.now()) / 1000)
      : Math.ceil(rateLimitConfig.windowMs / 1000);

    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        ...(rateLimit.blockInfo?.isBlocked && {
          blocked: true,
          escalationLevel: rateLimit.blockInfo.escalationLevel,
        }),
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

  return null; // No rate limit applied, continue to next middleware/route
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (SENSITIVE_PATHS.some((path) => pathname.includes(path))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Apply rate limiting to API routes
  if (pathname.startsWith("/api/")) {
    const rateLimitResult = applyRateLimit(request, pathname);
    if (rateLimitResult) {
      return rateLimitResult; // Return rate limit response
    }
  }

  const response = NextResponse.next();

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

  // Add Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' fonts.googleapis.com;
    font-src 'self' fonts.gstatic.com;
    img-src 'self' data: blob:;
    media-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com;
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  response.headers.set("Content-Security-Policy", cspHeader);

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
