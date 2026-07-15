/**
 * Email Template Components
 *
 * This module defines reusable components for building professional
 * email templates with consistent styling and structure.
 */

import {
  EmailComponent,
  SecurityInfo,
  HeaderComponentData,
  ContactInfoComponentData,
  MessageComponentData,
  CTAButtonComponentData,
  SocialLinksComponentData,
  FooterComponentData,
  StatusBadgeComponentData,
  DividerComponentData,
} from "./types";
import {
  escapeHtml,
  escapeHtmlWithLineBreaks,
  normalizePlainText,
  safeExternalUrl,
  safeMailto,
} from "./escape";

/**
 * Email Header Component
 * Renders a professional header with branding
 */
export const headerComponent: EmailComponent<HeaderComponentData> = {
  name: "header",
  render: (data: HeaderComponentData) => `
    <div class="email-header">
      ${
        data.branding.logoUrl
          ? `
        <img src="${safeExternalUrl(data.branding.logoUrl)}" alt="${escapeHtml(
              data.branding.siteName
            )}" style="max-height: 40px; margin-bottom: 15px;" />
      `
          : ""
      }
      <h1>${escapeHtml(data.title)}</h1>
      ${
        data.subtitle
          ? `<div class="subtitle">${escapeHtml(data.subtitle)}</div>`
          : ""
      }
    </div>
  `,
  renderText: (data: HeaderComponentData) => `
    ${normalizePlainText(data.branding.siteName).toUpperCase()}
    ${"=".repeat(data.branding.siteName.length)}
    
    ${normalizePlainText(data.title)}
    ${data.subtitle ? `${normalizePlainText(data.subtitle)}\n` : ""}
  `,
};

/**
 * Contact Information Table Component
 * Renders contact details in a structured table format
 */
export const contactInfoComponent: EmailComponent<ContactInfoComponentData> = {
  name: "contactInfo",
  render: (data: ContactInfoComponentData) => `
    <div class="section">
      <h3 class="section-title">📧 Contact Details</h3>
      <table class="info-table">
        <tr>
          <td class="label"><strong>Name:</strong></td>
          <td class="value">${escapeHtml(data.name)}</td>
        </tr>
        <tr>
          <td class="label"><strong>Email:</strong></td>
          <td class="value">
            <a href="${safeMailto(data.email)}" style="color: inherit; text-decoration: none;">
              ${escapeHtml(data.email)}
            </a>
          </td>
        </tr>
        <tr>
          <td class="label"><strong>Subject:</strong></td>
          <td class="value">${escapeHtml(data.subject)}</td>
        </tr>
      </table>
    </div>
    <br/>
  `,
  renderText: (data: ContactInfoComponentData) => `
    Contact Details:
    ================
    
    Name: ${normalizePlainText(data.name)}
    
    Email: ${normalizePlainText(data.email)}
    
    Subject: ${normalizePlainText(data.subject)}
  `,
};

/**
 * Message Content Component
 * Renders the main message content in a styled box
 */
export const messageComponent: EmailComponent<MessageComponentData> = {
  name: "message",
  render: (data: MessageComponentData) => `
    <div class="section">
      <h3 class="section-title">💬 Message</h3>
      <div class="message-box">
        <div class="message-content">${escapeHtmlWithLineBreaks(
          data.message
        )}</div>
      </div>
    </div>
    <br/><br/>
  `,
  renderText: (data: MessageComponentData) => `
    Message:
    ========
    
    ${normalizePlainText(data.message)}
  `,
};

/**
 * Security Information Component
 * Renders security and tracking information
 */
export const securityInfoComponent: EmailComponent<SecurityInfo> = {
  name: "securityInfo",
  render: (data: SecurityInfo) => `
    <div class="security-info">
      <h4>🔒 Security Information</h4>
      <p>
      <strong>IP Address:</strong> ${escapeHtml(data.ipAddress)}<br/>
      <strong>User Agent:</strong> ${escapeHtml(data.userAgent)}<br/>
      <strong>Timestamp:</strong> ${escapeHtml(data.timestamp)}
      ${
        data.sessionId
          ? `<br/><strong>Session ID:</strong> ${escapeHtml(data.sessionId)}`
          : ""
      }
      </p>
    </div>
  `,
  renderText: (data: SecurityInfo) => `
    Security Information:
    ====================
    
    IP Address: ${normalizePlainText(data.ipAddress)}
    User Agent: ${normalizePlainText(data.userAgent)}
    Timestamp: ${normalizePlainText(data.timestamp)}
    ${data.sessionId ? `Session ID: ${normalizePlainText(data.sessionId)}` : ""}
  `,
};

/**
 * Call-to-Action Button Component
 * Renders action buttons for email engagement
 */
export const ctaButtonComponent: EmailComponent<CTAButtonComponentData> = {
  name: "ctaButton",
  render: (data: CTAButtonComponentData) => `
    <div style="text-align: center; margin: 25px 0;">
      <a href="${safeExternalUrl(data.url)}" class="cta-button ${
    data.variant || "primary"
  }" target="_blank" rel="noopener noreferrer">
        ${escapeHtml(data.text)}
      </a>
    </div>
  `,
  renderText: (data: CTAButtonComponentData) => `
    ${normalizePlainText(data.text)}: ${normalizePlainText(data.url)}
  `,
};

/**
 * Social Links Component
 * Renders social media links with icons
 */
export const socialLinksComponent: EmailComponent<SocialLinksComponentData> = {
  name: "socialLinks",
  render: (data: SocialLinksComponentData) => {
    if (!data.socialLinks || data.socialLinks.length === 0) return "";

    return `
      <div class="social-links">
        ${data.socialLinks
          .map(
            (link) => `
          <a href="${safeExternalUrl(
            link.url
          )}" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(
              link.name
            )}">
            ${getSocialIcon(link.icon || link.name.toLowerCase())}
          </a>
        `
          )
          .join("")}
      </div>
    `;
  },
  renderText: (data: SocialLinksComponentData) => {
    if (!data.socialLinks || data.socialLinks.length === 0) return "";

    return `
    Social Links:
    ${data.socialLinks
      .map(
        (link) =>
          `${normalizePlainText(link.name)}: ${normalizePlainText(link.url)}`
      )
      .join("\n")}
    `;
  },
};

/**
 * Footer Component
 * Renders email footer with branding and links
 */
export const footerComponent: EmailComponent<FooterComponentData> = {
  name: "footer",
  render: (data: FooterComponentData) => `
    <div class="email-footer">
      <div class="footer-links">
        <a href="${safeExternalUrl(
          data.branding.websiteUrl
        )}" class="footer-link" target="_blank" rel="noopener noreferrer">
          Visit Website
        </a>
        <a href="${safeMailto(data.branding.contactEmail)}" class="footer-link">
          Contact Us
        </a>
        ${
          data.includeUnsubscribe
            ? `
          <a href="#" class="footer-link">
            Unsubscribe
          </a>
        `
            : ""
        }
      </div>
      
      ${
        data.branding.socialLinks
          ? socialLinksComponent.render({
              _type: "socialLinks" as const,
              socialLinks: data.branding.socialLinks,
            })
          : ""
      }
      
      <div class="footer-text">
        This email was sent from ${escapeHtml(data.branding.siteName)}<br>
        <a href="${safeExternalUrl(
          data.branding.websiteUrl
        )}" style="color: inherit;">${escapeHtml(
    data.branding.websiteUrl
  )}</a>
      </div>
    </div>
  `,
  renderText: (data: FooterComponentData) => `
    
    ---
    ${normalizePlainText(data.branding.siteName)}
    ${normalizePlainText(data.branding.websiteUrl)}
    
    ${
      data.branding.socialLinks
        ? socialLinksComponent.renderText!({
            _type: "socialLinks" as const,
            socialLinks: data.branding.socialLinks,
          })
        : ""
    }
    
    This email was sent from ${normalizePlainText(data.branding.siteName)}
  `,
};

/**
 * Divider Component
 * Renders a visual separator between sections
 */
export const dividerComponent: EmailComponent<DividerComponentData> = {
  name: "divider",
  render: () => `
    <div style="margin: 30px 0; text-align: center;">
      <div style="display: inline-block; width: 50px; height: 2px; background: linear-gradient(to right, transparent, #ccc, transparent);"></div>
    </div>
  `,
  renderText: () => "\n" + "-".repeat(50) + "\n",
};

/**
 * Status Badge Component
 * Renders status indicators for different message types
 */
export const statusBadgeComponent: EmailComponent<StatusBadgeComponentData> = {
  name: "statusBadge",
  render: (data: StatusBadgeComponentData) => `
    <div class="status-${
      data.status
    }" style="text-align: center; margin: 20px 0;">
      ${getStatusIcon(data.status)} ${escapeHtml(data.text)}
    </div>
  `,
  renderText: (data: StatusBadgeComponentData) => `
    [${data.status.toUpperCase()}] ${normalizePlainText(data.text)}
  `,
};

/**
 * Get social media icon SVG
 */
function getSocialIcon(iconName: string): string {
  const icons: Record<string, string> = {
    github: "GH",
    linkedin: "LI",
    twitter: "TW",
    facebook: "FB",
    instagram: "IG",
    youtube: "YT",
    email: "@",
    website: "🌐",
    default: "🔗",
  };

  return icons[iconName.toLowerCase()] || icons.default;
}

/**
 * Get status icon
 */
function getStatusIcon(status: "success" | "warning" | "error"): string {
  const icons = {
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  return icons[status];
}

/**
 * Component Registry
 */
export const components = {
  header: headerComponent,
  contactInfo: contactInfoComponent,
  message: messageComponent,
  securityInfo: securityInfoComponent,
  ctaButton: ctaButtonComponent,
  socialLinks: socialLinksComponent,
  footer: footerComponent,
  divider: dividerComponent,
  statusBadge: statusBadgeComponent,
} as const;

// ComponentName type moved to types.ts for better organization
