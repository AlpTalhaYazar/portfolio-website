"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { PortfolioContent, PortfolioLocale } from "@/types/portfolio";

import { usePortfolioTheme } from "@/components/portfolio/theme";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { PortfolioThemeToggle } from "./PortfolioThemeToggle";

interface HeaderProps {
  nav: PortfolioContent["nav"];
  locale: PortfolioLocale;
}

export function Header({ nav, locale }: HeaderProps) {
  const { isDark } = usePortfolioTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrolledBackground = isDark
    ? "rgba(8, 8, 8, 0.96)"
    : "rgba(244, 242, 237, 0.96)";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-border backdrop-blur-xl"
            : "bg-transparent"
        }`}
        style={isScrolled ? { backgroundColor: scrolledBackground } : undefined}
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#hero" className="mono-label text-foreground">
            {nav.homeLabel}
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <nav className="flex items-center gap-8">
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
            <LanguageSwitcher
              currentLocale={locale}
              label={nav.languageLabel}
              compact
            />
            <PortfolioThemeToggle locale={locale} />
            <a href="#contact" className="secondary-button">
              {nav.letsTalkLabel}
            </a>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <LanguageSwitcher
              currentLocale={locale}
              label={nav.languageLabel}
              compact
            />
            <PortfolioThemeToggle locale={locale} />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground"
              aria-label={isOpen ? nav.closeMenuLabel : nav.openMenuLabel}
              onClick={() => setIsOpen((current) => !current)}
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background"
          >
            <div className="mx-auto flex h-full max-w-6xl flex-col px-5 pb-8 pt-5">
              <div className="flex items-center justify-between border-b border-border pb-5">
                <span className="mono-label text-foreground">{nav.homeLabel}</span>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground"
                  aria-label={nav.closeMenuLabel}
                  onClick={() => setIsOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-1 flex-col justify-between py-10">
                <div className="flex flex-col">
                  {nav.items.map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                      className="border-b border-border py-5 text-4xl font-semibold tracking-[-0.04em] text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </div>

                <div className="flex flex-col gap-6">
                  <LanguageSwitcher currentLocale={locale} label={nav.languageLabel} />
                  <a
                    href="#contact"
                    className="primary-button justify-center"
                    onClick={() => setIsOpen(false)}
                  >
                    {nav.letsTalkLabel}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
