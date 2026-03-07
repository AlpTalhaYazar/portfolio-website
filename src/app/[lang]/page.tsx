import { notFound } from "next/navigation";

import { PortfolioPage } from "@/components/portfolio";
import { getPortfolioContent } from "@/lib/content/portfolio";
import { isSupportedLocale } from "@/lib/i18n/routing";
import { buildPortfolioMetadata } from "@/lib/seo/portfolio-metadata";

interface LocalePageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({ params }: LocalePageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang) || lang === "en") {
    return buildPortfolioMetadata("en");
  }

  return buildPortfolioMetadata(lang);
}

export async function generateStaticParams() {
  return [{ lang: "tr" }, { lang: "es" }];
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang) || lang === "en") {
    notFound();
  }

  return <PortfolioPage content={getPortfolioContent(lang)} locale={lang} />;
}
