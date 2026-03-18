export interface SiteLink {
  readonly label: string;
  readonly href: string;
}

function isLocalUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return ["localhost", "127.0.0.1", "0.0.0.0"].includes(url.hostname);
  } catch {
    return false;
  }
}

function resolveCanonicalBaseUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    "https://www.alptalha.dev",
  ];

  const publicCandidate = candidates.find(
    (value): value is string => value !== undefined && !isLocalUrl(value)
  );

  return (publicCandidate || "https://www.alptalha.dev").replace(/\/+$/, "");
}

const resolvedBaseUrl = resolveCanonicalBaseUrl();

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
