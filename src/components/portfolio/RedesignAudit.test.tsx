import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getPortfolioContent } from "@/lib/content/portfolio";
import { AnalyticsConsentProvider } from "@/components/analytics";

import { Capabilities } from "./Capabilities";
import { Footer } from "./Footer";
import { Hero } from "./Hero";

vi.mock("./LanguageSwitcher", () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
}));

describe("portfolio redesign fidelity", () => {
  const content = getPortfolioContent("en");

  it("uses the portfolio owner's name as the hero heading", () => {
    render(<Hero content={content.hero} />);

    expect(
      screen.getByRole("heading", { name: /Alp Talha Yazar/i })
    ).toBeInTheDocument();
    expect(screen.getByText(content.hero.headline)).toBeInTheDocument();
  });

  it("keeps the capabilities section on an auto-fit card matrix", () => {
    render(<Capabilities content={content.capabilities} />);

    const backendCard = screen.getByText("Backend").closest("article");
    const grid = backendCard?.parentElement;

    expect(grid).toHaveClass("grid-cols-[repeat(auto-fit,minmax(280px,1fr))]");
  });

  it("keeps the footer compact and icon-driven", () => {
    render(
      <AnalyticsConsentProvider locale="en">
        <Footer content={content.footer} nav={content.nav} locale="en" />
      </AnalyticsConsentProvider>
    );

    expect(screen.queryByTestId("language-switcher")).not.toBeInTheDocument();
    const githubLink = screen.getByRole("link", { name: "GitHub" });
    expect(githubLink).toHaveAttribute("aria-label", "GitHub");
    expect(githubLink).toHaveClass("h-10", "w-10");
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Privacy choices" })
    ).not.toBeInTheDocument();
  });
});
