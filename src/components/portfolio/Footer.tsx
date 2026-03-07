"use client";

import type { PortfolioContent, PortfolioLocale } from "@/types/portfolio";

import { socialLinks } from "@/lib/site";

import { LanguageSwitcher } from "./LanguageSwitcher";

interface FooterProps {
  content: PortfolioContent["footer"];
  nav: PortfolioContent["nav"];
  locale: PortfolioLocale;
}

export function Footer({ content, nav, locale }: FooterProps) {
  return (
    <footer className="border-t border-border bg-surface px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <a href="#hero" className="mono-label text-foreground">
            {nav.homeLabel}
          </a>
          <p className="mono-label text-muted-foreground">{content.strapline}</p>
        </div>

        <nav className="flex flex-wrap gap-6">
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
          <LanguageSwitcher currentLocale={locale} label={nav.languageLabel} />
          <div className="flex flex-wrap gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                className="mono-label text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-sm text-faint">
            © {new Date().getFullYear()} Alp Talha Yazar. {content.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
