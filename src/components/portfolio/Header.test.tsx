import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getPortfolioContent } from "@/lib/content/portfolio";
import { PortfolioThemeProvider } from "./theme";
import { Header } from "./Header";

vi.mock("./LanguageSwitcher", () => ({
  LanguageSwitcher: () => <button type="button">Language</button>,
}));

describe("Header mobile navigation", () => {
  const content = getPortfolioContent("en");

  beforeEach(() => {
    document.documentElement.className = "light-theme";
    document.body.style.overflow = "";
  });

  function renderHeader() {
    return render(
      <PortfolioThemeProvider>
        <Header nav={content.nav} locale="en" />
        <main id="main-content">
          <button type="button">Background action</button>
        </main>
        <footer>Footer</footer>
      </PortfolioThemeProvider>
    );
  }

  it("opens as a modal, focuses its close control, and isolates page content", async () => {
    renderHeader();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: content.nav.openMenuLabel }));

    const dialog = screen.getByRole("dialog", {
      name: content.nav.mobileNavLabel,
    });
    const closeButton = screen.getByRole("button", {
      name: content.nav.closeMenuLabel,
    });

    expect(dialog).toHaveAttribute("aria-modal", "true");
    await waitFor(() => expect(closeButton).toHaveFocus());
    expect(screen.getByRole("main", { hidden: true })).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("traps keyboard focus, closes on Escape, and restores trigger focus", async () => {
    renderHeader();
    const user = userEvent.setup();
    const trigger = screen.getByRole("button", {
      name: content.nav.openMenuLabel,
    });

    await user.click(trigger);
    const dialog = screen.getByRole("dialog");
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
    );

    focusable.at(-1)?.focus();
    await user.tab();
    expect(focusable[0]).toHaveFocus();

    focusable[0]?.focus();
    await user.tab({ shift: true });
    expect(focusable.at(-1)).toHaveFocus();

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(screen.getByRole("main")).not.toHaveAttribute("aria-hidden");
    expect(document.body.style.overflow).toBe("");
  });
});
