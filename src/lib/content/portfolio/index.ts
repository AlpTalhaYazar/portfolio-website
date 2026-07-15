import type { PortfolioLocale } from "@/types/portfolio";

import { portfolioContentEn } from "./en";
import { portfolioContentTr } from "./tr";

const portfolioContentByLocale = {
  en: portfolioContentEn,
  tr: portfolioContentTr,
} as const;

export function getPortfolioContent(locale: PortfolioLocale) {
  return portfolioContentByLocale[locale];
}

export {
  portfolioContentByLocale,
  portfolioContentEn,
  portfolioContentTr,
};
