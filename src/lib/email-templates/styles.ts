/**
 * Email Template Styles
 *
 * Professional email styles optimized for email client compatibility.
 */

/**
 * Generate base CSS styles for email template
 */
export function generateBaseStyles(): string {
  return `
    <style>
      /* Reset and base styles */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #333333;
        background-color: #f8f9fa;
        margin: 0;
        padding: 0;
      }

      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #e9ecef;
      }

      .email-header {
        background: linear-gradient(135deg, #2c3e50, #3498db);
        color: white;
        text-align: center;
        padding: 30px 20px;
      }

      .email-header h1 {
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 8px 0;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      }

      .email-header .subtitle {
        font-size: 16px;
        opacity: 0.9;
        font-weight: 400;
      }

      .email-content {
        padding: 40px 30px;
      }

      .section {
        margin-bottom: 30px;
      }

      .section:last-child {
        margin-bottom: 0;
      }

      .section-title {
        font-size: 20px;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 15px;
        border-bottom: 2px solid #e9ecef;
        padding-bottom: 8px;
      }

      .info-table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
      }

      .info-table td {
        padding: 12px 15px;
        border-bottom: 1px solid #e9ecef;
        vertical-align: top;
      }

      .info-table .label {
        font-weight: 600;
        color: #2c3e50;
        width: 120px;
        white-space: nowrap;
      }

      .info-table .value {
        color: #333333;
        word-break: break-word;
      }

      .message-content {
        background-color: #f8f9fa;
        border-left: 4px solid #3498db;
        padding: 20px;
        margin: 20px 0;
        border-radius: 0 8px 8px 0;
        font-style: italic;
        line-height: 1.7;
      }

      .security-info {
        background-color: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
      }

      .security-info h4 {
        color: #2c3e50;
        margin-bottom: 15px;
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .cta-button {
        display: inline-block;
        background: linear-gradient(135deg, #3498db, #2980b9);
        color: #ffffff;
        text-decoration: none;
        padding: 15px 30px;
        border-radius: 8px;
        font-weight: 600;
        text-align: center;
        margin: 20px 0;
        border: 2px solid #3498db;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
      }

      .cta-button.secondary {
        background: #6c757d;
        color: #ffffff;
        border-color: #6c757d;
      }

      .social-links {
        text-align: center;
        margin: 30px 0;
      }

      .social-links a {
        display: inline-block;
        margin: 0 10px;
        padding: 12px;
        background-color: #2c3e50;
        color: white;
        text-decoration: none;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        line-height: 20px;
        text-align: center;
        transition: all 0.3s ease;
      }

      .social-links a:hover {
        background-color: #3498db;
        transform: translateY(-2px);
      }

      .email-footer {
        background-color: #f8f9fa;
        color: #333333;
        text-align: center;
        padding: 30px 20px;
        border-top: 1px solid #e9ecef;
      }

      .email-footer p {
        margin: 8px 0;
        font-size: 14px;
        opacity: 0.8;
      }

      .divider {
        height: 2px;
        background: linear-gradient(90deg, transparent, #e9ecef, transparent);
        margin: 30px 0;
        border: none;
      }

      .status-badge {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .status-badge.success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }

      .status-badge.warning {
        background-color: #fff3cd;
        color: #856404;
        border: 1px solid #ffeaa7;
      }

      .status-badge.error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }

      /* Mobile responsiveness */
      @media only screen and (max-width: 600px) {
        .email-container {
          margin: 10px;
          border-radius: 0;
        }
        
        .email-content {
          padding: 20px 15px;
        }
        
        .email-header {
          padding: 20px 15px;
        }
        
        .email-header h1 {
          font-size: 24px;
        }
        
        .info-table .label {
          width: 100px;
          font-size: 14px;
        }
        
        .cta-button {
          display: block;
          margin: 20px 0;
          text-align: center;
        }
      }

      /* Note: Dark mode media queries are not well supported in most email clients
         and may be stripped out during delivery. For broader compatibility,
         consider using a single light theme optimized for all email clients. */
    </style>
  `;
}

/**
 * Generate inline styles for email template
 * These styles are applied directly to elements for better email client support
 */
export function generateInlineStyles(): Record<string, string> {
  return {
    body: "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f8f9fa; margin: 0; padding: 0;",
    container:
      "max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e9ecef;",
    header:
      "background: linear-gradient(135deg, #2c3e50, #3498db); color: white; text-align: center; padding: 30px 20px;",
    headerTitle:
      "font-size: 28px; font-weight: 700; margin: 0 0 8px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3);",
    content: "padding: 40px 30px;",
    section: "margin-bottom: 30px;",
    sectionTitle:
      "font-size: 20px; font-weight: 600; color: #2c3e50; margin-bottom: 15px; border-bottom: 2px solid #e9ecef; padding-bottom: 8px;",
    table: "width: 100%; border-collapse: collapse; margin: 15px 0;",
    tableCell:
      "padding: 12px 15px; border-bottom: 1px solid #e9ecef; vertical-align: top;",
    label:
      "font-weight: 600; color: #2c3e50; width: 120px; white-space: nowrap;",
    value: "color: #333333; word-break: break-word;",
    message:
      "background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; font-style: italic; line-height: 1.7;",
    button:
      "display: inline-block; background: linear-gradient(135deg, #3498db, #2980b9); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; text-align: center; margin: 20px 0; border: 2px solid #3498db; box-shadow: 0 4px 12px rgba(0,0,0,0.15);",
    footer:
      "background-color: #f8f9fa; color: #333333; text-align: center; padding: 30px 20px; border-top: 1px solid #e9ecef;",
  };
}
