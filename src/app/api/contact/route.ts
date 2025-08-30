import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import {
  checkRateLimit,
  getClientIP,
  verifyOrigin,
  validateHoneypot,
  sanitizeInput,
  detectSpam,
  logSecurityEvent,
} from "@/lib/security";

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
});

export async function POST(request: NextRequest) {
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

    // 2. Rate limiting
    const rateLimit = checkRateLimit(request, 15 * 60 * 1000, 5); // 5 requests per 15 minutes
    if (!rateLimit.allowed) {
      logSecurityEvent({
        type: "rate_limit",
        ip: clientIP,
        userAgent,
      });
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              (rateLimit.resetTime! - Date.now()) / 1000
            ).toString(),
          },
        }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate input data
    const validatedData = contactSchema.parse(body);
    const { name, email, subject, message, honeypot } = validatedData;

    // 3. Honeypot validation (bot detection)
    if (!validateHoneypot(honeypot)) {
      logSecurityEvent({
        type: "spam_detected",
        ip: clientIP,
        userAgent,
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
        details: { reason: "content_analysis", data: sanitizedData },
      });
      // Return success to fool spammers
      return NextResponse.json({
        success: true,
        message: "Message sent successfully!",
      });
    }

    // Check for required environment variables
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    const emailTo = process.env.EMAIL_TO || process.env.GMAIL_USER;

    if (!gmailUser || !gmailAppPassword) {
      console.error("Gmail credentials not configured properly");
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
        rejectUnauthorized: false,
      },
    });

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log("Gmail SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("Gmail SMTP verification failed:", verifyError);
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

    // Email content with security information
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            📧 New Contact Form Submission
          </h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 15px;">Contact Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${cleanName}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Email:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;"><a href="mailto:${cleanEmail}" style="color: #007bff;">${cleanEmail}</a></td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Subject:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${cleanSubject}</td>
              </tr>
            </table>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 15px;">Message:</h3>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
              <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${cleanMessage}</p>
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; font-size: 12px;">
            <h4 style="color: #555; margin-bottom: 10px;">Security Information:</h4>
            <p><strong>IP Address:</strong> ${clientIP}</p>
            <p><strong>User Agent:</strong> ${userAgent}</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p style="margin-top: 15px; text-align: center;">This email was sent from your portfolio contact form</p>
          </div>
        </div>
      </div>
    `;

    const textContent = `
      NEW CONTACT FORM SUBMISSION
      ===========================

      Contact Details:
      - Name: ${cleanName}
      - Email: ${cleanEmail}
      - Subject: ${cleanSubject}

      Message:
      ${cleanMessage}

      Security Information:
      - IP Address: ${clientIP}
      - User Agent: ${userAgent}
      - Timestamp: ${new Date().toLocaleString()}

      ---
      Sent from portfolio contact form
    `;

    // Email options
    const mailOptions = {
      from: `"${cleanName} via Portfolio" <${gmailUser}>`, // sender address
      to: emailTo, // recipient
      replyTo: cleanEmail, // reply to the contact person
      subject: `Portfolio Contact: ${cleanSubject}`,
      text: textContent,
      html: htmlContent,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully!",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((e) => e.message).join(", "),
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
