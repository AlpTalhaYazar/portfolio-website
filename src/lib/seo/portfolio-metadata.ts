import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";
import type { PortfolioLocale } from "@/types/portfolio";

import { getPortfolioContent } from "../content/portfolio";

const localeToOpenGraph = {
  en: "en_US",
  tr: "tr_TR",
  es: "es_ES",
} as const;

function getCanonicalUrl(locale: PortfolioLocale): string {
  return locale === "en" ? `${siteConfig.baseUrl}/` : `${siteConfig.baseUrl}/${locale}/`;
}

export function buildPortfolioMetadata(locale: PortfolioLocale): Metadata {
  const content = getPortfolioContent(locale);

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: {
      canonical: getCanonicalUrl(locale),
      languages: {
        en: `${siteConfig.baseUrl}/`,
        tr: `${siteConfig.baseUrl}/tr/`,
        es: `${siteConfig.baseUrl}/es/`,
        "x-default": `${siteConfig.baseUrl}/`,
      },
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      type: "website",
      url: getCanonicalUrl(locale),
      siteName: siteConfig.fullName,
      locale: localeToOpenGraph[locale],
      alternateLocale: Object.values(localeToOpenGraph).filter(
        (value) => value !== localeToOpenGraph[locale]
      ),
    },
    twitter: {
      card: "summary_large_image",
      title: content.metadata.title,
      description: content.metadata.description,
    },
  };
}
