import { NextResponse } from "next/server";

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  environment: string;
  checks: {
    email: { status: "ok" | "warning" | "error"; message: string };
    redis: { status: "ok" | "warning" | "error"; message: string };
    analytics: { status: "ok" | "warning" | "error"; message: string };
  };
  uptime: number;
}

// Track server start time for uptime calculation
const startTime = Date.now();

/**
 * Health check endpoint for monitoring and load balancer health probes
 *
 * Returns:
 * - 200: All systems operational
 * - 503: One or more critical systems are down
 */
export async function GET() {
  const checks = {
    email: checkEmailConfig(),
    redis: checkRedisConfig(),
    analytics: checkAnalyticsConfig(),
  };

  // Determine overall status
  const hasErrors = Object.values(checks).some((c) => c.status === "error");
  const hasWarnings = Object.values(checks).some((c) => c.status === "warning");

  const overallStatus: HealthStatus["status"] = hasErrors
    ? "unhealthy"
    : hasWarnings
    ? "degraded"
    : "healthy";

  const healthStatus: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "0.1.0",
    environment: process.env.NODE_ENV || "development",
    checks,
    uptime: Math.floor((Date.now() - startTime) / 1000),
  };

  const httpStatus = overallStatus === "unhealthy" ? 503 : 200;

  return NextResponse.json(healthStatus, {
    status: httpStatus,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function checkEmailConfig(): HealthStatus["checks"]["email"] {
  // Use direct env access to avoid validation errors during health check
  const hasGmailUser = Boolean(process.env.GMAIL_USER);
  const hasGmailPassword = Boolean(process.env.GMAIL_APP_PASSWORD);

  if (hasGmailUser && hasGmailPassword) {
    return { status: "ok", message: "Email configuration complete" };
  }

  if (hasGmailUser || hasGmailPassword) {
    return {
      status: "warning",
      message: "Partial email configuration (missing credentials)",
    };
  }

  return {
    status: "warning",
    message: "Email not configured (contact form will not work)",
  };
}

function checkRedisConfig(): HealthStatus["checks"]["redis"] {
  const hasRedisUrl = Boolean(process.env.UPSTASH_REDIS_REST_URL);
  const hasRedisToken = Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

  if (hasRedisUrl && hasRedisToken) {
    return { status: "ok", message: "Redis configured" };
  }

  return {
    status: "warning",
    message: "Redis not configured (rate limiting uses in-memory storage)",
  };
}

function checkAnalyticsConfig(): HealthStatus["checks"]["analytics"] {
  const hasAnalytics = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  const isProduction = process.env.NODE_ENV === "production";

  if (hasAnalytics) {
    return { status: "ok", message: "Google Analytics enabled" };
  }

  if (isProduction) {
    return {
      status: "warning",
      message: "Analytics not configured for production",
    };
  }

  return {
    status: "ok",
    message: "Analytics disabled (development mode)",
  };
}
