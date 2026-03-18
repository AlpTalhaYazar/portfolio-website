import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getPortfolioContent } from "@/lib/content/portfolio";

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
      <Footer
        content={content.footer}
        nav={content.nav}
      />
    );

    expect(screen.queryByTestId("language-switcher")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "aria-label",
      "GitHub"
    );
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
  });
});
