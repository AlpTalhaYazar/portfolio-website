import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input data
    const validatedData = contactSchema.parse(body);
    const { name, email, subject, message } = validatedData;

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

    // Email content
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
                <td style="padding: 12px; border: 1px solid #dee2e6;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Email:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;"><a href="mailto:${email}" style="color: #007bff;">${email}</a></td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Subject:</td>
                <td style="padding: 12px; border: 1px solid #dee2e6;">${subject}</td>
              </tr>
            </table>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 15px;">Message:</h3>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
              <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #666; font-size: 14px;">
            <p>This email was sent from your portfolio contact form at ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    `;

    const textContent = `
      NEW CONTACT FORM SUBMISSION
      ===========================

      Contact Details:
      - Name: ${name}
      - Email: ${email}
      - Subject: ${subject}

      Message:
      ${message}

      ---
      Sent from portfolio contact form at ${new Date().toLocaleString()}
    `;

    // Email options
    const mailOptions = {
      from: `"${name} via Portfolio" <${gmailUser}>`, // sender address
      to: emailTo, // recipient
      replyTo: email, // reply to the contact person
      subject: `Portfolio Contact: ${subject}`,
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
