/**
 * Email Template System Types
 *
 * This module defines TypeScript types for the email template system,
 * providing type safety and structure for email generation.
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Theme system removed - using static professional styling

export interface EmailBranding {
  /** Site/company name */
  siteName: string;
  /** Logo URL (optional) */
  logoUrl?: string;
  /** Website URL */
  websiteUrl: string;
  /** Contact email */
  contactEmail: string;
  /** Social media links */
  socialLinks?: {
    name: string;
    url: string;
    icon?: string;
  }[];
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SecurityInfo {
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  sessionId?: string;
}

export interface ContactEmailData {
  contactData: ContactFormData;
  securityInfo: SecurityInfo;
  branding: EmailBranding;
}

export interface EmailTemplateOptions {
  /** Include responsive CSS */
  responsive?: boolean;
  /** Include dark mode support */
  darkMode?: boolean;
  /** Include security information */
  includeSecurityInfo?: boolean;
  /** Custom CSS to inject */
  customCss?: string;
  /** Email client compatibility mode */
  compatibility?: "modern" | "legacy" | "auto";
}

export interface EmailComponent<T> {
  /** Component name for identification */
  name: string;
  /** Generate HTML for the component */
  render: (data: T) => string;
  /** Generate text version */
  renderText?: (data: T) => string;
}

export interface EmailLayout {
  /** Layout name */
  name: string;
  /** Main content area template */
  template: string;
  /** CSS styles for the layout */
  styles: string;
  /** Text version template */
  textTemplate?: string;
}

export type EmailTemplateType =
  | "contact"
  | "notification"
  | "welcome"
  | "reset-password"
  | "newsletter";

export interface EmailTemplateConfig {
  type: EmailTemplateType;
  layout: string;
  components: string[];
  options?: EmailTemplateOptions;
}

// Component-specific data types
export interface HeaderComponentData {
  title: string;
  subtitle?: string;
  branding: EmailBranding;
}

export interface ContactInfoComponentData {
  name: string;
  email: string;
  subject: string;
}

export interface MessageComponentData {
  message: string;
}

export interface CTAButtonComponentData {
  text: string;
  url: string;
  variant?: "primary" | "secondary";
}

export interface SocialLinksComponentData {
  socialLinks: Array<{
    name: string;
    url: string;
    icon?: string;
  }>;
}

export interface FooterComponentData {
  branding: EmailBranding;
  includeUnsubscribe?: boolean;
}

export interface StatusBadgeComponentData {
  status: "success" | "warning" | "error";
  text: string;
}

export interface DividerComponentData {
  // Divider component requires no data, but we need a proper interface
  _placeholder?: never;
}

// Discriminated union for type safety
export interface ComponentDataWithType {
  header: HeaderComponentData & { _type: "header" };
  contactInfo: ContactInfoComponentData & { _type: "contactInfo" };
  message: MessageComponentData & { _type: "message" };
  securityInfo: SecurityInfo & { _type: "securityInfo" };
  ctaButton: CTAButtonComponentData & { _type: "ctaButton" };
  socialLinks: SocialLinksComponentData & { _type: "socialLinks" };
  footer: FooterComponentData & { _type: "footer" };
  divider: DividerComponentData & { _type: "divider" };
  statusBadge: StatusBadgeComponentData & { _type: "statusBadge" };
}

// Component name to data type mapping (for type constraints)
export interface ComponentDataMap {
  header: HeaderComponentData;
  contactInfo: ContactInfoComponentData;
  message: MessageComponentData;
  securityInfo: SecurityInfo;
  ctaButton: CTAButtonComponentData;
  socialLinks: SocialLinksComponentData;
  footer: FooterComponentData;
  divider: DividerComponentData;
  statusBadge: StatusBadgeComponentData;
}

// Union type for all component data
export type ComponentData =
  | HeaderComponentData
  | ContactInfoComponentData
  | MessageComponentData
  | SecurityInfo
  | CTAButtonComponentData
  | SocialLinksComponentData
  | FooterComponentData
  | StatusBadgeComponentData
  | DividerComponentData;

// Type guards for runtime type checking
export function isHeaderData(data: ComponentData): data is HeaderComponentData {
  return "title" in data && "branding" in data;
}

export function isContactInfoData(
  data: ComponentData
): data is ContactInfoComponentData {
  return "name" in data && "email" in data && "subject" in data;
}

export function isMessageData(
  data: ComponentData
): data is MessageComponentData {
  return "message" in data && !("name" in data);
}

export function isSecurityInfoData(data: ComponentData): data is SecurityInfo {
  return "ipAddress" in data && "userAgent" in data && "timestamp" in data;
}

export function isCTAButtonData(
  data: ComponentData
): data is CTAButtonComponentData {
  return "text" in data && "url" in data;
}

export function isSocialLinksData(
  data: ComponentData
): data is SocialLinksComponentData {
  return "socialLinks" in data;
}

export function isFooterData(data: ComponentData): data is FooterComponentData {
  return "branding" in data && !("title" in data);
}

export function isDividerData(
  data: ComponentData
): data is DividerComponentData {
  return (
    !("title" in data) &&
    !("message" in data) &&
    !("name" in data) &&
    !("ipAddress" in data) &&
    !("text" in data) &&
    !("socialLinks" in data) &&
    !("branding" in data)
  );
}

export function isStatusBadgeData(
  data: ComponentData
): data is StatusBadgeComponentData {
  return "status" in data && "text" in data && !("url" in data);
}
