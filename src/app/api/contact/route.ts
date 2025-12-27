import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import {
  getClientIP,
  verifyOrigin,
  validateHoneypot,
  sanitizeInput,
  detectSpam,
  logSecurityEvent,
  verifyCSRFToken,
  cleanupExpiredTokens,
} from "@/lib/security";
import { logger } from "@/lib/logger";
import { createContactEmail } from "@/lib/email-templates";
import { serverEnv, clientEnv } from "@/lib/env";

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message too long"),
  honeypot: z.string().optional(), // Hidden field for bot detection
  csrfToken: z.string().min(1, "Security token is required"), // CSRF protection
});

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "unknown";

  try {
    // 0. Clean up expired tokens periodically
    cleanupExpiredTokens();

    // 1. Origin verification
    const allowedOrigins = [
      clientEnv.siteUrl || "http://localhost:3000",
      clientEnv.baseUrl || "",
      `https://www.${clientEnv.baseUrl?.replace("https://www.", "") || ""}`,
    ];

    if (!verifyOrigin(request, allowedOrigins)) {
      logSecurityEvent({
        type: "origin_violation",
        ip: clientIP,
        userAgent,
        severity: "high",
        timestamp: new Date().toISOString(),
        details: {
          origin: request.headers.get("origin"),
          referer: request.headers.get("referer"),
        },
      });
      return NextResponse.json(
        { error: "Unauthorized request origin" },
        { status: 403 }
      );
    }

    // 2. Rate limiting now handled in middleware for all API routes

    // Parse request body
    const body = await request.json();

    // Validate input data
    const validatedData = contactSchema.parse(body);
    const { name, email, subject, message, honeypot, csrfToken } =
      validatedData;

    // 2. CSRF Token verification
    const sessionId = request.headers.get("x-session-id");
    if (!sessionId) {
      logSecurityEvent({
        type: "csrf_violation",
        ip: clientIP,
        userAgent,
        severity: "high",
        timestamp: new Date().toISOString(),
        details: { reason: "missing_session_id" },
      });
      return NextResponse.json(
        { error: "Invalid request. Missing session information." },
        { status: 403 }
      );
    }

    const csrfVerification = verifyCSRFToken(csrfToken, sessionId);
    if (!csrfVerification.valid) {
      logSecurityEvent({
        type: "csrf_violation",
        ip: clientIP,
        userAgent,
        severity: "high",
        timestamp: new Date().toISOString(),
        details: {
          reason: csrfVerification.reason,
          sessionId,
          providedToken: csrfToken ? "present" : "missing",
        },
      });
      return NextResponse.json(
        {
          error:
            "Security validation failed. Please refresh the page and try again.",
        },
        { status: 403 }
      );
    }

    // 3. Honeypot validation (bot detection)
    if (!validateHoneypot(honeypot)) {
      logSecurityEvent({
        type: "spam_detected",
        ip: clientIP,
        userAgent,
        severity: "medium",
        timestamp: new Date().toISOString(),
        details: { reason: "honeypot_filled", honeypot },
      });
      // Return success to fool bots
      return NextResponse.json({
        success: true,
        message: "Message sent successfully!",
      });
    }

    // 4. Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
    };

    // 5. Spam detection
    if (detectSpam(sanitizedData)) {
      logSecurityEvent({
        type: "spam_detected",
        ip: clientIP,
        userAgent,
        severity: "medium",
        timestamp: new Date().toISOString(),
        details: { reason: "content_analysis", data: sanitizedData },
      });
      // Return success to fool spammers
      return NextResponse.json({
        success: true,
        message: "Message sent successfully!",
      });
    }

    // Check for required environment variables
    const gmailUser = serverEnv.gmailUser;
    const gmailAppPassword = serverEnv.gmailAppPassword;
    const emailTo = serverEnv.emailTo;

    if (!gmailUser || !gmailAppPassword) {
      logger.error("Gmail credentials not configured properly");

      return NextResponse.json(
        {
          error:
            "Email service not configured. Please contact the administrator.",
          details: "Missing Gmail credentials in environment variables",
        },
        { status: 500 }
      );
    }

    // Create nodemailer transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    // Verify connection configuration
    try {
      await transporter.verify();

      logger.dev.log("Gmail SMTP connection verified successfully");
    } catch (verifyError) {
      logger.error("Gmail SMTP verification failed:", verifyError);

      return NextResponse.json(
        {
          error: "Email service configuration error",
          details: "Failed to connect to Gmail SMTP server",
        },
        { status: 500 }
      );
    }

    // Use sanitized data for email
    const {
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
    } = sanitizedData;

    // Generate professional email template
    const emailTemplate = createContactEmail(
      {
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
      },
      {
        _type: "securityInfo" as const,
        ipAddress: clientIP,
        userAgent,
        timestamp: new Date().toLocaleString(),
        sessionId,
      }
    );

    // Email options with professional template
    const mailOptions = {
      from: `"${cleanName} via Portfolio" <${gmailUser}>`, // sender address
      to: emailTo, // recipient
      replyTo: cleanEmail, // reply to the contact person
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    logger.dev.log("Email sent successfully:", info.messageId);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully!",
      messageId: info.messageId,
    });
  } catch (error) {
    logger.error("Error sending email:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: "Failed to send email. Please try again later.",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
