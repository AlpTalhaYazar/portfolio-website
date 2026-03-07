import type { PortfolioLocale } from "@/types/portfolio";

import { portfolioContentEn } from "./en";
import { portfolioContentEs } from "./es";
import { portfolioContentTr } from "./tr";

const portfolioContentByLocale = {
  en: portfolioContentEn,
  tr: portfolioContentTr,
  es: portfolioContentEs,
} as const;

export function getPortfolioContent(locale: PortfolioLocale) {
  return portfolioContentByLocale[locale];
}

export {
  portfolioContentByLocale,
  portfolioContentEn,
  portfolioContentTr,
  portfolioContentEs,
};
