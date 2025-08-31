/**
 * Email Template Builder
 *
 * This module provides utilities for building professional email templates
 * with dynamic content, themes, and responsive design.
 */

import {
  EmailTemplate,
  EmailBranding,
  ContactEmailData,
  EmailTemplateOptions,
  EmailTemplateConfig,
  SecurityInfo,
  ComponentDataMap,
  ComponentData,
  ComponentName,
  HeaderComponentData,
  ContactInfoComponentData,
  MessageComponentData,
  CTAButtonComponentData,
  FooterComponentData,
  StatusBadgeComponentData,
  DividerComponentData,
  isHeaderData,
  isContactInfoData,
  isMessageData,
  isSecurityInfoData,
  isCTAButtonData,
  isSocialLinksData,
  isFooterData,
  isDividerData,
  isStatusBadgeData,
} from "./types";
import { generateBaseStyles } from "./styles";
import {
  headerComponent,
  contactInfoComponent,
  messageComponent,
  securityInfoComponent,
  ctaButtonComponent,
  socialLinksComponent,
  footerComponent,
  dividerComponent,
  statusBadgeComponent,
} from "./components";

/**
 * Unified component renderer using registry pattern
 * Eliminates code duplication and improves maintainability
 */
function renderComponent(
  componentName: ComponentName,
  data: ComponentData,
  method: "render" | "renderText" = "render"
): string {
  const entry = componentRegistry[componentName];
  if (entry && entry.typeGuard(data)) {
    if (method === "render") {
      return entry.component.render(data);
    } else {
      return entry.component.renderText?.(data) || "";
    }
  }
  return "";
}

/**
 * Unified component validation using registry pattern
 * Eliminates duplication with renderComponent function
 */
function isValidComponentData(
  componentName: ComponentName,
  data: ComponentData
): boolean {
  const entry = componentRegistry[componentName];
  return entry ? entry.typeGuard(data) : false;
}
// Component registry to eliminate code duplication and improve maintainability
// Note: Using unknown type with type guards ensures type safety at runtime
interface RegistryEntry {
  typeGuard: (data: ComponentData) => boolean;
  component: {
    render: (data: unknown) => string;
    renderText?: (data: unknown) => string;
  };
}

const componentRegistry: Record<ComponentName, RegistryEntry> = {
  header: {
    typeGuard: isHeaderData,
    component: headerComponent as RegistryEntry["component"],
  },
  contactInfo: {
    typeGuard: isContactInfoData,
    component: contactInfoComponent as RegistryEntry["component"],
  },
  message: {
    typeGuard: isMessageData,
    component: messageComponent as RegistryEntry["component"],
  },
  securityInfo: {
    typeGuard: isSecurityInfoData,
    component: securityInfoComponent as RegistryEntry["component"],
  },
  ctaButton: {
    typeGuard: isCTAButtonData,
    component: ctaButtonComponent as RegistryEntry["component"],
  },
  socialLinks: {
    typeGuard: isSocialLinksData,
    component: socialLinksComponent as RegistryEntry["component"],
  },
  footer: {
    typeGuard: isFooterData,
    component: footerComponent as RegistryEntry["component"],
  },
  divider: {
    typeGuard: isDividerData,
    component: dividerComponent as RegistryEntry["component"],
  },
  statusBadge: {
    typeGuard: isStatusBadgeData,
    component: statusBadgeComponent as RegistryEntry["component"],
  },
};

// Static professional branding
const defaultBranding: EmailBranding = {
  siteName: "Portfolio Contact",
  websiteUrl: "https://portfolio.com",
  contactEmail: "contact@portfolio.com",
};

/**
 * Email Template Builder Class
 * Provides a fluent API for building email templates
 */
export class EmailTemplateBuilder {
  private branding: EmailBranding;
  private options: EmailTemplateOptions;
  private componentData = new Map<string, ComponentData>();
  private componentOrder: ComponentName[] = [];

  constructor(branding?: EmailBranding, options?: EmailTemplateOptions) {
    this.branding = branding || defaultBranding;
    this.options = {
      responsive: true,
      darkMode: true,
      includeSecurityInfo: true,
      compatibility: "modern",
      ...options,
    };
  }

  /**
   * Set branding information
   */
  setBranding(branding: EmailBranding): this {
    this.branding = branding;
    return this;
  }

  /**
   * Set template options
   */
  setOptions(options: Partial<EmailTemplateOptions>): this {
    this.options = { ...this.options, ...options };
    return this;
  }

  /**
   * Add a component to the template
   */
  addComponent<K extends ComponentName>(
    componentName: K,
    data: ComponentDataMap[K]
  ): this {
    this.componentData.set(componentName, data);
    this.componentOrder.push(componentName);
    return this;
  }

  /**
   * Add header component
   */
  addHeader(title: string, subtitle?: string): this {
    const data: HeaderComponentData = {
      _type: "header" as const,
      title,
      subtitle,
      branding: this.branding,
    };
    return this.addComponent("header", data);
  }

  /**
   * Add contact information component
   */
  addContactInfo(name: string, email: string, subject: string): this {
    const data: ContactInfoComponentData = {
      _type: "contactInfo" as const,
      name,
      email,
      subject,
    };
    return this.addComponent("contactInfo", data);
  }

  /**
   * Add message component
   */
  addMessage(message: string): this {
    const data: MessageComponentData = {
      _type: "message" as const,
      message,
    };
    return this.addComponent("message", data);
  }

  /**
   * Add security information component
   */
  addSecurityInfo(securityInfo: SecurityInfo): this {
    return this.addComponent("securityInfo", securityInfo);
  }

  /**
   * Add CTA button component
   */
  addButton(
    text: string,
    url: string,
    variant?: "primary" | "secondary"
  ): this {
    const data: CTAButtonComponentData = {
      _type: "ctaButton" as const,
      text,
      url,
      variant,
    };
    return this.addComponent("ctaButton", data);
  }

  /**
   * Add divider component
   */
  addDivider(): this {
    const data: DividerComponentData = {
      _type: "divider" as const,
    };
    return this.addComponent("divider", data);
  }

  /**
   * Add status badge component
   */
  addStatusBadge(status: "success" | "warning" | "error", text: string): this {
    const data: StatusBadgeComponentData = {
      _type: "statusBadge" as const,
      status,
      text,
    };
    return this.addComponent("statusBadge", data);
  }

  /**
   * Add footer component
   */
  addFooter(includeUnsubscribe = false): this {
    const data: FooterComponentData = {
      _type: "footer" as const,
      branding: this.branding,
      includeUnsubscribe,
    };
    return this.addComponent("footer", data);
  }

  /**
   * Generate the complete email template
   */
  build(): EmailTemplate {
    const htmlContent = this.generateHTML();
    const textContent = this.generateText();
    const subject = this.generateSubject();

    return {
      subject,
      html: htmlContent,
      text: textContent,
    };
  }

  /**
   * Generate HTML content
   */
  private generateHTML(): string {
    const styles = generateBaseStyles();

    const componentsHTML = this.componentOrder
      .map((componentName) => {
        const data = this.componentData.get(componentName);

        if (!data) {
          return "";
        }

        // Use centralized component renderer to eliminate DRY violation
        return renderComponent(componentName, data, "render");
      })
      .join("\n");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Email from ${this.branding.siteName}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    ${styles}
    ${this.options.customCss || ""}
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-wrapper">
      <div class="email-card">
        ${componentsHTML}
      </div>
    </div>
  </div>
</body>
</html>`.trim();
  }

  /**
   * Generate text content
   */
  private generateText(): string {
    const componentsText = this.componentOrder
      .map((componentName) => {
        const data = this.componentData.get(componentName);

        if (!data) {
          return "";
        }

        // Use centralized component renderer to eliminate DRY violation
        return renderComponent(componentName, data, "renderText");
      })
      .filter((text) => text.trim())
      .join("\n\n");

    return componentsText;
  }

  /**
   * Generate email subject
   */
  private generateSubject(): string {
    // Try to get subject from contact info component
    const contactData = this.componentData.get("contactInfo");
    if (contactData && "subject" in contactData && contactData.subject) {
      return `${this.branding.siteName}: ${contactData.subject}`;
    }

    // Fallback to generic subject
    return `New message from ${this.branding.siteName}`;
  }
}

/**
 * Quick builder functions for common email types
 */

/**
 * Build a contact form email template
 */
export function buildContactEmail(data: ContactEmailData): EmailTemplate {
  const builder = new EmailTemplateBuilder(data.branding);

  return builder
    .addHeader(
      "📧 New Contact Form Submission",
      "You have received a new message"
    )
    .addContactInfo(
      data.contactData.name,
      data.contactData.email,
      data.contactData.subject
    )
    .addMessage(data.contactData.message)
    .addDivider()
    .addButton("Reply to Message", `mailto:${data.contactData.email}`)
    .addSecurityInfo(data.securityInfo)
    .addFooter()
    .build();
}

/**
 * Build a notification email template
 */
export function buildNotificationEmail(
  title: string,
  message: string,
  type: "success" | "warning" | "error" = "success",
  branding?: EmailBranding
): EmailTemplate {
  const builder = new EmailTemplateBuilder(branding);

  return builder
    .addHeader(title)
    .addStatusBadge(type, message)
    .addFooter()
    .build();
}

/**
 * Build email from configuration
 */
export function buildFromConfig(
  config: EmailTemplateConfig,
  data: Partial<ComponentDataMap>
): EmailTemplate {
  const builder = new EmailTemplateBuilder(defaultBranding, config.options);

  // Add components based on configuration using centralized resolver
  config.components.forEach((componentName) => {
    const componentKey = componentName as keyof ComponentDataMap;
    const componentData = data[componentKey];

    if (componentData && isValidComponentData(componentName, componentData)) {
      // Use centralized component validation to eliminate DRY violation
      builder.addComponent(componentName, componentData);
    }
  });

  return builder.build();
}

/**
 * Validate email template HTML
 */
export function validateEmailHTML(html: string): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check for common email HTML issues
  if (!html.includes("<!DOCTYPE html>")) {
    warnings.push("Missing DOCTYPE declaration");
  }

  if (!html.includes('meta name="viewport"')) {
    warnings.push("Missing viewport meta tag for mobile responsiveness");
  }

  if (html.includes("<script")) {
    errors.push("JavaScript is not supported in email clients");
  }

  if (html.includes("position: fixed") || html.includes("position: absolute")) {
    warnings.push(
      "Fixed/absolute positioning may not work in all email clients"
    );
  }

  if (!html.includes("style=") && html.includes("class=")) {
    warnings.push(
      "Consider using inline styles for better email client compatibility"
    );
  }

  const imageCount = (html.match(/<img/g) || []).length;
  if (imageCount > 10) {
    warnings.push(
      `High number of images (${imageCount}) may affect loading time`
    );
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Preview email template (returns HTML for testing)
 */
export function previewTemplate(template: EmailTemplate): string {
  return `
    <div style="padding: 20px; background: #f5f5f5;">
      <h2>Email Preview</h2>
      <p><strong>Subject:</strong> ${template.subject}</p>
      <div style="margin: 20px 0; border: 1px solid #ddd;">
        ${template.html}
      </div>
      <details>
        <summary>Text Version</summary>
        <pre style="background: white; padding: 15px; border: 1px solid #ddd; white-space: pre-wrap;">${template.text}</pre>
      </details>
    </div>
  `;
}
