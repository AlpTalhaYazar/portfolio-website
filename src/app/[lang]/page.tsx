import { notFound } from "next/navigation";

import { PortfolioPage } from "@/components/portfolio";
import { getPortfolioContent } from "@/lib/content/portfolio";
import { isSupportedLocale, publicPortfolioLocales } from "@/lib/i18n/routing";
import { buildPortfolioMetadata } from "@/lib/seo/portfolio-metadata";

interface LocalePageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({ params }: LocalePageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang) || lang === "tr") {
    return buildPortfolioMetadata("tr");
  }

  return buildPortfolioMetadata(lang);
}

export async function generateStaticParams() {
  return publicPortfolioLocales
    .filter((locale) => locale !== "tr")
    .map((locale) => ({ lang: locale }));
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang) || lang === "tr") {
    notFound();
  }

  return <PortfolioPage content={getPortfolioContent(lang)} locale={lang} />;
}
