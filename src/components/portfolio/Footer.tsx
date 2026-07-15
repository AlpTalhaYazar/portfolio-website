"use client";

import { BriefcaseBusiness, Code2, Mail } from "lucide-react";

import Link from "next/link";

import { analyticsConsentCopy, useAnalyticsConsent } from "@/components/analytics";
import type { PortfolioContent, PortfolioLocale } from "@/types/portfolio";

import { getPreferredScrollBehavior } from "@/lib/accessibility/motion";
import { buildLocalizedHref } from "@/lib/i18n/routing";
import { socialLinks } from "@/lib/site";

interface FooterProps {
  content: PortfolioContent["footer"];
  nav: PortfolioContent["nav"];
  locale: PortfolioLocale;
}

export function Footer({ content, nav, locale }: FooterProps) {
  const { isAvailable: isAnalyticsAvailable, openPreferences } =
    useAnalyticsConsent();
  const privacyCopy = analyticsConsentCopy[locale];

  return (
    <footer className="border-t border-border bg-surface px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <button
            type="button"
            className="mono-label cursor-pointer border-0 bg-transparent p-0 text-left text-foreground"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: getPreferredScrollBehavior(),
              })
            }
          >
            {nav.homeLabel}
          </button>
          <p className="mono-label text-muted-foreground">{content.strapline}</p>
        </div>

        <nav aria-label={nav.footerNavLabel} className="flex flex-wrap gap-6">
          {nav.items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="mono-label text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col items-start gap-4 lg:items-end">
          <div className="flex flex-wrap gap-4">
            {socialLinks.map((link) => {
              const Icon =
                link.label === "GitHub"
                  ? Code2
                  : link.label === "LinkedIn"
                  ? BriefcaseBusiness
                  : Mail;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                  aria-label={link.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
          <p className="text-sm text-faint">
            © {new Date().getFullYear()} Alp Talha Yazar. {content.copyright}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link
              href={buildLocalizedHref(locale, "/privacy")}
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {privacyCopy.privacy}
            </Link>
            {isAnalyticsAvailable ? (
              <button
                type="button"
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                onClick={openPreferences}
              >
                {privacyCopy.settings}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
