import type { NextRequest } from "next/server";

import { logger } from "@/lib/logger";
import type { SecurityEvent } from "@/types";

const DEVELOPMENT_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

function getRequestOrigin(request: NextRequest): URL | null {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const candidate = origin || referer;

  if (!candidate) return null;

  try {
    return new URL(candidate);
  } catch {
    return null;
  }
}

export function verifyOrigin(
  request: NextRequest,
  allowedOrigins: readonly string[]
): boolean {
  const requestOrigin = getRequestOrigin(request);

  if (!requestOrigin) {
    logger.security("origin_verification_failed", { reason: "missing_or_invalid" });
    return process.env.NODE_ENV === "development";
  }

  if (requestOrigin.origin === request.nextUrl.origin) {
    return true;
  }

  if (
    process.env.NODE_ENV === "development" &&
    DEVELOPMENT_HOSTNAMES.has(requestOrigin.hostname)
  ) {
    return true;
  }

  const normalizedAllowedOrigins = new Set(
    allowedOrigins.flatMap((candidate) => {
      try {
        return [new URL(candidate).origin];
      } catch {
        return [];
      }
    })
  );
  const isAllowed = normalizedAllowedOrigins.has(requestOrigin.origin);

  if (!isAllowed) {
    logger.security("origin_verification_failed", {
      reason: "not_allowed",
      originHost: requestOrigin.hostname,
    });
  }

  return isAllowed;
}

export function isSecureRequest(request: NextRequest): boolean {
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",", 1)[0]
    ?.trim()
    .toLowerCase();

  return request.nextUrl.protocol === "https:" || forwardedProtocol === "https";
}

export function validateHoneypot(
  honeypotValue: string | null | undefined
): boolean {
  return !honeypotValue || honeypotValue.trim() === "";
}

export function logSecurityEvent(event: SecurityEvent): void {
  const logData = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
  };

  if (event.severity === "critical" || event.severity === "high") {
    logger.error(`security_${event.type}`, logData);
  } else if (event.severity === "medium") {
    logger.warn(`security_${event.type}`, logData);
  } else {
    logger.security(`security_${event.type}`, logData);
  }
}
