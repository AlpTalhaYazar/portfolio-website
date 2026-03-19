"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { buildLocalizedHref } from "@/lib/i18n/routing";
import type { PortfolioLocale, PortfolioNotFoundContent } from "@/types/portfolio";

import { PortfolioThemeToggle } from "./PortfolioThemeToggle";

interface NotFoundPageProps {
  content: PortfolioNotFoundContent;
  locale: PortfolioLocale;
}

export function NotFoundPage({ content, locale }: NotFoundPageProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-24 sm:px-8">
      <div className="absolute inset-0 shell-grid opacity-50" />
      <div className="absolute right-5 top-6 z-20 sm:right-8">
        <PortfolioThemeToggle locale={locale} variant="labeled" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <div className="mb-7 flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-accent" />
          <span className="mono-label text-accent">{content.eyebrow}</span>
          <div className="h-px w-8 bg-accent" />
        </div>
        <p className="text-[clamp(6rem,16vw,11rem)] font-bold leading-none tracking-[-0.08em] text-surface-2">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
          {content.title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
          {content.description}
        </p>

        <div className="mt-10 flex justify-center gap-3">
          <Link href={buildLocalizedHref(locale, "/")} className="primary-button">
            {content.primaryCta}
          </Link>
          <button
            type="button"
            className="secondary-button"
            onClick={() => window.history.back()}
          >
            {content.secondaryCta}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
