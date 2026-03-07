"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { buildLocalizedHref, publicPortfolioLocales } from "@/lib/i18n/routing";
import type { PortfolioLocale } from "@/types/portfolio";

const LABELS: Record<PortfolioLocale, string> = {
  en: "EN",
  tr: "TR",
  es: "ES",
};

interface LanguageSwitcherProps {
  currentLocale: PortfolioLocale;
  label: string;
  compact?: boolean;
}

export function LanguageSwitcher({
  currentLocale,
  label,
  compact = false,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const [suffix, setSuffix] = useState("");

  useEffect(() => {
    const syncSuffix = () => {
      setSuffix(`${window.location.search}${window.location.hash}`);
    };

    syncSuffix();
    window.addEventListener("hashchange", syncSuffix);

    return () => window.removeEventListener("hashchange", syncSuffix);
  }, [pathname]);

  const baseHref = useMemo(
    () => `${pathname || "/"}${suffix}`,
    [pathname, suffix]
  );

  return (
    <div
      aria-label={label}
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-surface/90 p-1 ${
        compact ? "" : "backdrop-blur"
      }`}
    >
      {publicPortfolioLocales.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <Link
            key={locale}
            href={buildLocalizedHref(locale, baseHref)}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium tracking-[0.18em] transition-colors ${
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {LABELS[locale]}
          </Link>
        );
      })}
    </div>
  );
}
