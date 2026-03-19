"use client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getPortfolioContent } from "@/lib/content/portfolio";
import { PORTFOLIO_THEME_STORAGE_KEY } from "@/lib/portfolio/theme";

import { Header } from "./Header";
import { NotFoundPage } from "./NotFoundPage";
import { PortfolioThemeProvider } from "./theme";

vi.mock("./LanguageSwitcher", () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
}));

describe("portfolio theme controls", () => {
  const content = getPortfolioContent("en");

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "dark-theme";
    document.head.innerHTML = '<meta name="theme-color" content="#080808" />';
  });

  it("keeps the language switcher and adds theme toggles to the header", async () => {
    render(
      <PortfolioThemeProvider>
        <Header nav={content.nav} locale="en" />
      </PortfolioThemeProvider>
    );

    expect(screen.getAllByTestId("language-switcher")).toHaveLength(2);

    const toggles = screen.getAllByRole("button", {
      name: /switch to light theme/i,
    });

    expect(toggles).toHaveLength(2);

    const user = userEvent.setup();
    await user.click(toggles[0]);

    expect(document.documentElement).toHaveClass("light-theme");
    expect(localStorage.getItem(PORTFOLIO_THEME_STORAGE_KEY)).toBe("light");
  });

  it("renders the labeled 404 toggle in the redesigned top-right position", () => {
    render(
      <PortfolioThemeProvider>
        <NotFoundPage content={content.notFound} locale="en" />
      </PortfolioThemeProvider>
    );

    expect(
      screen.getByRole("button", { name: /switch to light theme/i })
    ).toBeVisible();
    expect(screen.getByText("LIGHT")).toBeVisible();
  });
});
