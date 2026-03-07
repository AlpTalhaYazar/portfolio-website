export interface SiteLink {
  readonly label: string;
  readonly href: string;
}

const resolvedBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.alptalha.dev";

export const siteConfig = {
  baseUrl: resolvedBaseUrl.replace(/\/+$/, ""),
  fullName: process.env.NEXT_PUBLIC_FULL_NAME || "Alp Talha Yazar",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@alptalha.dev",
  location: process.env.NEXT_PUBLIC_CONTACT_LOCATION || "Turkey",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/alptalha",
  linkedInUrl:
    process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/alptalha",
} as const;

export const socialLinks: readonly SiteLink[] = [
  { label: "GitHub", href: siteConfig.githubUrl },
  { label: "LinkedIn", href: siteConfig.linkedInUrl },
  { label: "Email", href: `mailto:${siteConfig.email}` },
];

export const contactDetails: readonly SiteLink[] = [
  { label: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { label: siteConfig.linkedInUrl.replace(/^https?:\/\//, ""), href: siteConfig.linkedInUrl },
  { label: siteConfig.githubUrl.replace(/^https?:\/\//, ""), href: siteConfig.githubUrl },
];
