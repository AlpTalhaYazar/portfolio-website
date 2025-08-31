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
  _type: "securityInfo";
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

export type ComponentName =
  | "header"
  | "contactInfo"
  | "message"
  | "securityInfo"
  | "ctaButton"
  | "socialLinks"
  | "footer"
  | "divider"
  | "statusBadge";

export interface EmailTemplateConfig {
  type: EmailTemplateType;
  layout: string;
  components: ComponentName[];
  options?: EmailTemplateOptions;
}

// Component-specific data types
export interface HeaderComponentData {
  _type: "header";
  title: string;
  subtitle?: string;
  branding: EmailBranding;
}

export interface ContactInfoComponentData {
  _type: "contactInfo";
  name: string;
  email: string;
  subject: string;
}

export interface MessageComponentData {
  _type: "message";
  message: string;
}

export interface CTAButtonComponentData {
  _type: "ctaButton";
  text: string;
  url: string;
  variant?: "primary" | "secondary";
}

export interface SocialLinksComponentData {
  _type: "socialLinks";
  socialLinks: Array<{
    name: string;
    url: string;
    icon?: string;
  }>;
}

export interface FooterComponentData {
  _type: "footer";
  branding: EmailBranding;
  includeUnsubscribe?: boolean;
}

export interface StatusBadgeComponentData {
  _type: "statusBadge";
  status: "success" | "warning" | "error";
  text: string;
}

export interface DividerComponentData {
  _type: "divider";
  // Divider component requires minimal data with proper type discrimination
}

// Removed redundant ComponentDataWithType interface -
// ComponentDataMap already provides the same functionality

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

// Type guards using discriminated union - robust and maintainable!
export function isHeaderData(data: ComponentData): data is HeaderComponentData {
  return (
    typeof data === "object" &&
    data !== null &&
    "_type" in data &&
    data._type === "header"
  );
}

export function isContactInfoData(
  data: ComponentData
): data is ContactInfoComponentData {
  return (
    typeof data === "object" &&
    data !== null &&
    "_type" in data &&
    data._type === "contactInfo"
  );
}

export function isMessageData(
  data: ComponentData
): data is MessageComponentData {
  return (
    typeof data === "object" &&
    data !== null &&
    "_type" in data &&
    data._type === "message"
  );
}

export function isSecurityInfoData(data: ComponentData): data is SecurityInfo {
  return (
    typeof data === "object" &&
    data !== null &&
    "_type" in data &&
    data._type === "securityInfo"
  );
}

export function isCTAButtonData(
  data: ComponentData
): data is CTAButtonComponentData {
  return (
    typeof data === "object" &&
    data !== null &&
    "_type" in data &&
    data._type === "ctaButton"
  );
}

export function isSocialLinksData(
  data: ComponentData
): data is SocialLinksComponentData {
  return (
    typeof data === "object" &&
    data !== null &&
    "_type" in data &&
    data._type === "socialLinks"
  );
}

export function isFooterData(data: ComponentData): data is FooterComponentData {
  return (
    typeof data === "object" &&
    data !== null &&
    "_type" in data &&
    data._type === "footer"
  );
}

export function isDividerData(
  data: ComponentData
): data is DividerComponentData {
  return (
    typeof data === "object" &&
    data !== null &&
    "_type" in data &&
    data._type === "divider"
  );
}

export function isStatusBadgeData(
  data: ComponentData
): data is StatusBadgeComponentData {
  return (
    typeof data === "object" &&
    data !== null &&
    "_type" in data &&
    data._type === "statusBadge"
  );
}
