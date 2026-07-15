import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  getCsrfCookieName,
  getCsrfSecret,
  verifyCsrfCredential,
} from "@/lib/csrf";
import { createContactEmail } from "@/lib/email-templates";
import { clientEnv, serverEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import {
  isSecureRequest,
  validateHoneypot,
  verifyOrigin,
} from "@/lib/security";

const MAX_REQUEST_BYTES = 16_384;

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100, "Name too long"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(254, "Email too long"),
  subject: z
    .string()
    .trim()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject too long"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message too long"),
  honeypot: z.string().max(200).optional(),
  csrfToken: z.string().min(1).max(4096),
});

function jsonError(code: string, error: string, status: number) {
  return NextResponse.json(
    { success: false, code, error },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

function getAllowedOrigins(): string[] {
  return [clientEnv.siteUrl, clientEnv.baseUrl].flatMap((value) => {
    try {
      return [new URL(value).origin];
    } catch {
      return [];
    }
  });
}

function normalizeHeaderText(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function POST(request: NextRequest) {
  if (!verifyOrigin(request, getAllowedOrigins())) {
    logger.warn("contact.origin_forbidden", { path: request.nextUrl.pathname });
    return jsonError(
      "origin_forbidden",
      "Request origin is not allowed.",
      403
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return jsonError("payload_too_large", "Request body is too large.", 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(
      "invalid_json",
      "Request body must be valid JSON.",
      400
    );
  }

  const parsedBody = contactSchema.safeParse(body);
  if (!parsedBody.success) {
    return jsonError(
      "validation_failed",
      "Please review the submitted fields and try again.",
      422
    );
  }

  const { name, email, subject, message, honeypot, csrfToken } = parsedBody.data;
  const sessionId = request.headers.get("x-session-id");
  const csrfVerification = verifyCsrfCredential({
    secret: getCsrfSecret(),
    token: csrfToken,
    cookieToken: request.cookies.get(
      getCsrfCookieName(isSecureRequest(request))
    )?.value,
    sessionId,
  });

  if (!csrfVerification.valid) {
    logger.warn("contact.csrf_invalid", {
      reason: csrfVerification.reason,
      path: request.nextUrl.pathname,
    });
    return jsonError(
      "csrf_invalid",
      "Security validation failed. Refresh the page and try again.",
      403
    );
  }

  if (!validateHoneypot(honeypot)) {
    logger.warn("contact.automation_rejected", { signal: "honeypot" });
    return NextResponse.json(
      { success: true, message: "Message sent successfully." },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const gmailUser = serverEnv.gmailUser;
  const gmailAppPassword = serverEnv.gmailAppPassword;
  const emailTo = serverEnv.emailTo;

  if (!gmailUser || !gmailAppPassword || !emailTo) {
    logger.error("contact.email_not_configured");
    return jsonError(
      "email_unavailable",
      "Message delivery is temporarily unavailable. Please try again later.",
      503
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
    tls: { rejectUnauthorized: true },
    connectionTimeout: 5_000,
    greetingTimeout: 5_000,
    socketTimeout: 10_000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });

  try {
    await transporter.verify();

    const emailTemplate = createContactEmail(
      {
        name,
        email,
        subject: normalizeHeaderText(subject),
        message,
      },
      {
        _type: "securityInfo" as const,
        ipAddress: "Not retained",
        userAgent: "Not retained",
        timestamp: new Date().toISOString(),
        sessionId: "Not retained",
      }
    );

    await transporter.sendMail({
      from: `"Portfolio Contact" <${gmailUser}>`,
      to: emailTo,
      replyTo: email,
      subject: normalizeHeaderText(emailTemplate.subject),
      text: emailTemplate.text,
      html: emailTemplate.html,
      disableFileAccess: true,
      disableUrlAccess: true,
    });
  } catch (error) {
    logger.error("contact.delivery_failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json(
      {
        success: false,
        code: "delivery_unavailable",
        error: "Message delivery is temporarily unavailable. Please try again.",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": "30",
        },
      }
    );
  }

  logger.info("contact.delivery_succeeded");
  return NextResponse.json(
    { success: true, message: "Message sent successfully." },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "POST, OPTIONS",
      "Cache-Control": "no-store",
    },
  });
}
