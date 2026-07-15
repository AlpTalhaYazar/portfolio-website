import type { Metadata } from "next";

import { defaultLanguage } from "@/lib/i18n/config";
import { publicPortfolioLocales } from "@/lib/i18n/routing";
import { siteConfig } from "@/lib/site";
import type { PortfolioLocale } from "@/types/portfolio";

import { getPortfolioContent } from "../content/portfolio";
import {
  getSocialPreviewAlt,
  getSocialPreviewUrl,
  socialPreviewSize,
} from "./social-preview";

const localeToOpenGraph = {
  en: "en_US",
  tr: "tr_TR",
} as const;

export function buildNotFoundMetadata(): Metadata {
  return {
    title: "Page not found | Alp Talha Yazar",
    description: "The requested portfolio page could not be found.",
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export function getCanonicalUrl(locale: PortfolioLocale): string {
  return locale === defaultLanguage
    ? `${siteConfig.baseUrl}/`
    : `${siteConfig.baseUrl}/${locale}/`;
}

export function buildPortfolioMetadata(locale: PortfolioLocale): Metadata {
  const content = getPortfolioContent(locale);
  const openGraphImage = {
    url: getSocialPreviewUrl(locale, "opengraph"),
    width: socialPreviewSize.width,
    height: socialPreviewSize.height,
    alt: getSocialPreviewAlt(locale),
  };
  const twitterImage = {
    url: getSocialPreviewUrl(locale, "twitter"),
    alt: getSocialPreviewAlt(locale),
  };

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: {
      canonical: getCanonicalUrl(locale),
      languages: {
        en: `${siteConfig.baseUrl}/en/`,
        tr: `${siteConfig.baseUrl}/`,
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
      images: [openGraphImage],
      alternateLocale: publicPortfolioLocales
        .map((supportedLocale) => localeToOpenGraph[supportedLocale])
        .filter((value) => value !== localeToOpenGraph[locale]),
    },
    twitter: {
      card: "summary_large_image",
      title: content.metadata.title,
      description: content.metadata.description,
      images: [twitterImage],
    },
  };
}
