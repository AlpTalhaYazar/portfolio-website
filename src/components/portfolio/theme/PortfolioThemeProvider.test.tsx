"use client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

  it("hydrates stored dark preference without a recoverable mismatch", async () => {
    const markup = renderToString(
      <PortfolioThemeProvider>
        <ThemeHarness />
      </PortfolioThemeProvider>
    );
    const container = document.createElement("div");
    container.innerHTML = markup;
    document.body.append(container);
    localStorage.setItem(PORTFOLIO_THEME_STORAGE_KEY, "dark");
    document.documentElement.className = "dark-theme";
    const onRecoverableError = vi.fn();

    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(
        container,
        <PortfolioThemeProvider>
          <ThemeHarness />
        </PortfolioThemeProvider>,
        { onRecoverableError }
      );
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(container.querySelector("button")).toHaveTextContent("dark");

    await act(async () => root.unmount());
    container.remove();
  });
});
