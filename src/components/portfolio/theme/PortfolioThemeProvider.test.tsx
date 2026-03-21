"use client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { PortfolioThemeProvider, usePortfolioTheme } from "./PortfolioThemeProvider";
import {
  PORTFOLIO_THEME_COLOR,
  PORTFOLIO_THEME_STORAGE_KEY,
} from "@/lib/portfolio/theme";

function ThemeHarness() {
  const { isDark, toggleTheme } = usePortfolioTheme();

  return (
    <button type="button" onClick={toggleTheme}>
      {isDark ? "dark" : "light"}
    </button>
  );
}

describe("PortfolioThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
    document.head.innerHTML = '<meta name="theme-color" content="#080808" />';
  });

  it("defaults to the light portfolio theme", () => {
    render(
      <PortfolioThemeProvider>
        <ThemeHarness />
      </PortfolioThemeProvider>
    );

    expect(screen.getByRole("button", { name: "light" })).toBeVisible();
    expect(document.documentElement).toHaveClass("light-theme");
    expect(document.documentElement).not.toHaveClass("dark-theme");
    expect(localStorage.getItem(PORTFOLIO_THEME_STORAGE_KEY)).toBe("light");
    expect(
      document.querySelector('meta[name="theme-color"]')
    ).toHaveAttribute("content", PORTFOLIO_THEME_COLOR.light);
  });

  it("hydrates from the stored theme", () => {
    localStorage.setItem(PORTFOLIO_THEME_STORAGE_KEY, "dark");

    render(
      <PortfolioThemeProvider>
        <ThemeHarness />
      </PortfolioThemeProvider>
    );

    expect(screen.getByRole("button", { name: "dark" })).toBeVisible();
    expect(document.documentElement).toHaveClass("dark-theme");
    expect(document.documentElement).not.toHaveClass("light-theme");
    expect(
      document.querySelector('meta[name="theme-color"]')
    ).toHaveAttribute("content", PORTFOLIO_THEME_COLOR.dark);
  });

  it("toggles the theme, persistence, and theme-color together", async () => {
    render(
      <PortfolioThemeProvider>
        <ThemeHarness />
      </PortfolioThemeProvider>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "light" }));

    expect(screen.getByRole("button", { name: "dark" })).toBeVisible();
    expect(document.documentElement).toHaveClass("dark-theme");
    expect(localStorage.getItem(PORTFOLIO_THEME_STORAGE_KEY)).toBe("dark");
    expect(
      document.querySelector('meta[name="theme-color"]')
    ).toHaveAttribute("content", PORTFOLIO_THEME_COLOR.dark);
  });
});
