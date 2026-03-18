"use client";

import { Moon, Sun } from "lucide-react";

import { usePortfolioTheme } from "@/components/portfolio/theme";
import type { PortfolioLocale } from "@/types/portfolio";

type PortfolioThemeToggleVariant = "icon" | "labeled";

interface PortfolioThemeToggleProps {
  locale: PortfolioLocale;
  variant?: PortfolioThemeToggleVariant;
}

const themeToggleCopy = {
  en: {
    lightLabel: "LIGHT",
    darkLabel: "DARK",
    switchToLight: "Switch to light theme",
    switchToDark: "Switch to dark theme",
  },
  tr: {
    lightLabel: "AYDINLIK",
    darkLabel: "KOYU",
    switchToLight: "Açık temaya geç",
    switchToDark: "Koyu temaya geç",
  },
  es: {
    lightLabel: "CLARO",
    darkLabel: "OSCURO",
    switchToLight: "Cambiar a tema claro",
    switchToDark: "Cambiar a tema oscuro",
  },
} as const;

export function PortfolioThemeToggle({
  locale,
  variant = "icon",
}: PortfolioThemeToggleProps) {
  const { isDark, toggleTheme } = usePortfolioTheme();
  const copy = themeToggleCopy[locale];
  const label = isDark ? copy.lightLabel : copy.darkLabel;
  const ariaLabel = isDark ? copy.switchToLight : copy.switchToDark;
  const Icon = isDark ? Sun : Moon;

  if (variant === "labeled") {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-3.5 py-2 font-[var(--font-jetbrains-mono)] text-[11px] tracking-[0.08em] text-muted-foreground transition-colors hover:border-border-strong hover:bg-surface hover:text-foreground"
        onClick={toggleTheme}
      >
        <Icon size={12} />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-border bg-transparent text-muted-foreground transition-colors hover:border-border-strong hover:bg-surface hover:text-foreground"
      onClick={toggleTheme}
    >
      <Icon size={13} />
    </button>
  );
}
