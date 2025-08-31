/**
 * Email Templates Module
 *
 * A professional email template system for contact forms and notifications.
 * Provides type-safe, responsive, and customizable email templates.
 */

// Core exports
export type {
  EmailTemplate,
  EmailBranding,
  EmailTemplateOptions,
  EmailTemplateConfig,
  ContactFormData,
  SecurityInfo,
  ComponentData,
  HeaderComponentData,
  ContactInfoComponentData,
  MessageComponentData,
  CTAButtonComponentData,
  SocialLinksComponentData,
  FooterComponentData,
  StatusBadgeComponentData,
  DividerComponentData,
} from "./types";

export { EmailTemplateBuilder, buildFromConfig } from "./builder";
export { generateBaseStyles, generateInlineStyles } from "./styles";
export * from "./components";

import { EmailTemplateBuilder } from "./builder";
import type {
  ContactFormData,
  SecurityInfo,
  EmailTemplate,
  EmailBranding,
  EmailTemplateOptions,
} from "./types";

/**
 * Create a professional contact email template
 */
export function createContactEmail(
  formData: ContactFormData,
  securityInfo: SecurityInfo,
  branding?: EmailBranding,
  options?: EmailTemplateOptions
): EmailTemplate {
  const builder = new EmailTemplateBuilder(branding, options);

  return builder
    .addHeader(
      "New Contact Message",
      "You have received a new message from your portfolio website"
    )
    .addContactInfo(formData.name, formData.email, formData.subject)
    .addMessage(formData.message)
    .addSecurityInfo(securityInfo)
    .addDivider()
    .addFooter()
    .build();
}

/**
 * Create a simple notification email
 */
export function createNotificationEmail(
  title: string,
  message: string,
  branding?: EmailBranding
): EmailTemplate {
  const builder = new EmailTemplateBuilder(branding);

  return builder.addHeader(title).addMessage(message).addFooter().build();
}
