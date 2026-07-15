import { NextRequest, NextResponse } from "next/server";

import {
  getCsrfCookieName,
  getCsrfSecret,
  issueCsrfCredential,
} from "@/lib/csrf";
import { logger } from "@/lib/logger";
import { isSecureRequest, verifyOrigin } from "@/lib/security";

function getAllowedOrigins(): string[] {
  return [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined,
  ].flatMap((value) => {
    if (!value) {
      return [];
    }

    try {
      return [new URL(value).origin];
    } catch {
      return [];
    }
  });
}

export async function GET(request: NextRequest) {
  if (!verifyOrigin(request, getAllowedOrigins())) {
    logger.warn("csrf.origin_forbidden", {
      path: request.nextUrl.pathname,
    });

    return NextResponse.json(
      {
        success: false,
        code: "origin_forbidden",
        error: "Request origin is not allowed.",
      },
      {
        status: 403,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  try {
    const credential = issueCsrfCredential({ secret: getCsrfSecret() });
    const secureRequest = isSecureRequest(request);
    const response = NextResponse.json(
      {
        success: true,
        token: credential.token,
        sessionId: credential.sessionId,
        expires: credential.expires,
        expiresIn: credential.expiresIn,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
          Pragma: "no-cache",
          Vary: "Origin",
        },
      }
    );

    response.cookies.set(
      getCsrfCookieName(secureRequest),
      credential.token,
      {
        httpOnly: true,
        secure: secureRequest,
        sameSite: "strict",
        path: "/",
        maxAge: credential.expiresIn,
      }
    );

    return response;
  } catch (error) {
    logger.error("csrf.issue_failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });

    return NextResponse.json(
      {
        success: false,
        code: "csrf_unavailable",
        error: "Security initialization is temporarily unavailable.",
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
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "GET, OPTIONS",
      "Cache-Control": "no-store",
    },
  });
}
