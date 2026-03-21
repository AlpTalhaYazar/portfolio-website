import { headers } from "next/headers";

import { NotFoundPage } from "@/components/portfolio";
import { getPortfolioContent } from "@/lib/content/portfolio";
import type { PortfolioLocale } from "@/types/portfolio";

export default async function LocaleNotFound() {
  const headersList = await headers();
  const localeHeader = headersList.get("x-locale");
  const locale: PortfolioLocale =
    localeHeader === "en" ? "en" : "tr";

  return <NotFoundPage content={getPortfolioContent(locale).notFound} locale={locale} />;
}
