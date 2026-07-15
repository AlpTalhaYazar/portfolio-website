"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const prefersReducedMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const scrolledBackground = isDark
    ? "rgba(8, 8, 8, 0.96)"
    : "rgba(244, 242, 237, 0.96)";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) {
        triggerRef.current?.focus();
        wasOpenRef.current = false;
      }
      return;
    }

    wasOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    const backgroundElements = [
      headerRef.current,
      document.querySelector<HTMLElement>("main"),
      document.querySelector<HTMLElement>("footer"),
    ].filter((element): element is HTMLElement => Boolean(element));
    const backgroundState = backgroundElements.map((element) => ({
      element,
      ariaHidden: element.getAttribute("aria-hidden"),
      inert: element.inert,
    }));

    document.body.style.overflow = "hidden";
    for (const { element } of backgroundState) {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    }
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      for (const { element, ariaHidden, inert } of backgroundState) {
        element.inert = inert;
        if (ariaHidden === null) {
          element.removeAttribute("aria-hidden");
        } else {
          element.setAttribute("aria-hidden", ariaHidden);
        }
      }
    };
  }, [isOpen]);

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) ?? []
    ).filter((element) => !element.hasAttribute("hidden"));

    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <header
        ref={headerRef}
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
            <nav aria-label={nav.primaryNavLabel} className="flex items-center gap-8">
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
              ref={triggerRef}
              type="button"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
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
            ref={dialogRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label={nav.mobileNavLabel}
            onKeyDown={handleDialogKeyDown}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background"
          >
            <div className="mx-auto flex h-full max-w-6xl flex-col px-5 pb-8 pt-5">
              <div className="flex items-center justify-between border-b border-border pb-5">
                <span className="mono-label text-foreground">{nav.homeLabel}</span>
                <button
                  ref={closeButtonRef}
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
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 18 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: prefersReducedMotion ? 0 : index * 0.06,
                        duration: prefersReducedMotion ? 0 : undefined,
                      }}
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
