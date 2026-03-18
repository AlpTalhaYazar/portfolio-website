"use client";

import { Github, Linkedin, Mail } from "lucide-react";

import type { PortfolioContent } from "@/types/portfolio";

import { socialLinks } from "@/lib/site";

interface FooterProps {
  content: PortfolioContent["footer"];
  nav: PortfolioContent["nav"];
}

export function Footer({ content, nav }: FooterProps) {
  return (
    <footer className="border-t border-border bg-surface px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <button
            type="button"
            className="mono-label cursor-pointer border-0 bg-transparent p-0 text-left text-foreground"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {nav.homeLabel}
          </button>
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
          <div className="flex flex-wrap gap-4">
            {socialLinks.map((link) => {
              const Icon =
                link.label === "GitHub"
                  ? Github
                  : link.label === "LinkedIn"
                  ? Linkedin
                  : Mail;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                  aria-label={link.label}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
          <p className="text-sm text-faint">
            © {new Date().getFullYear()} Alp Talha Yazar. {content.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
