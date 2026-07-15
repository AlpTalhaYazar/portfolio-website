import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PrivacyPage } from "@/components/portfolio";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy | Alp Talha Yazar",
  description: "How the portfolio handles optional analytics, contact-form data, and local preferences.",
  alternates: {
    canonical: `${siteConfig.baseUrl}/en/privacy/`,
    languages: {
      tr: `${siteConfig.baseUrl}/privacy/`,
      en: `${siteConfig.baseUrl}/en/privacy/`,
      "x-default": `${siteConfig.baseUrl}/privacy/`,
    },
  },
};

export default async function EnglishPrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "en") notFound();

  return <PrivacyPage locale="en" />;
}
