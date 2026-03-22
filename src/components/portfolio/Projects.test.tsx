import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { getPortfolioContent } from "@/lib/content/portfolio";

import { Projects } from "./Projects";

function mockViewport(isDesktop: boolean) {
  vi.mocked(globalThis.matchMedia).mockImplementation((query: string) => ({
    matches: query === "(min-width: 1280px)" ? isDesktop : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("Projects", () => {
  it("renders dossier triggers for all project cards across locales", () => {
    mockViewport(false);

    for (const locale of ["en", "tr", "es"] as const) {
      const content = getPortfolioContent(locale).projects;
      const { unmount } = render(<Projects content={content} />);

      expect(
        screen.getByRole("heading", { name: content.intro })
      ).toBeInTheDocument();
      expect(screen.getAllByRole("article")).toHaveLength(content.items.length);
      expect(
        screen.getAllByRole("button", { name: new RegExp(content.expandLabel, "i") })
      ).toHaveLength(content.items.length);

      const wiroArticle = screen
        .getByRole("heading", { name: /wiro ai/i })
        .closest("article");
      const jetlinkArticle = screen
        .getByRole("heading", { name: /jetlink/i })
        .closest("article");

      expect(wiroArticle).not.toBeNull();
      expect(jetlinkArticle).not.toBeNull();
      expect(within(wiroArticle as HTMLElement).queryByRole("button")).not.toBeNull();
      expect(within(jetlinkArticle as HTMLElement).queryByRole("button")).not.toBeNull();

      unmount();
    }
  });

  it("reveals the active Dias dossier inline on mobile and shows item-level disclosure", async () => {
    mockViewport(false);

    const content = getPortfolioContent("en").projects;

    render(<Projects content={content} />);

    expect(screen.queryByText(content.summaryTitle)).not.toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(
      screen.getAllByRole("button", {
        name: new RegExp(content.expandLabel, "i"),
      })[0]
    );

    expect(
      screen.getByRole("button", {
        name: new RegExp(content.collapseLabel, "i"),
      })
    ).toBeInTheDocument();
    const activeArticle = screen
      .getAllByRole("heading", { name: /enterprise management platform/i })[0]
      .closest("article");

    expect(activeArticle).not.toBeNull();
    expect(
      within(activeArticle as HTMLElement).getByText(content.summaryTitle)
    ).toBeInTheDocument();
    expect(
      within(activeArticle as HTMLElement).getByText(content.responsibilitiesTitle)
    ).toBeInTheDocument();
    expect(
      within(activeArticle as HTMLElement).getByText(content.footprintTitle)
    ).toBeInTheDocument();
    expect(
      within(activeArticle as HTMLElement).getByText(
        content.items[0].details?.note ?? ""
      )
    ).toBeInTheDocument();
    expect(
      within(activeArticle as HTMLElement).getByText(
        content.items[0].details?.badgeLabel ?? ""
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/massTransit-based communication patterns/i)
    ).toBeInTheDocument();
  });

  it("reveals Wiro and Jetlink dossiers inline on mobile", async () => {
    mockViewport(false);

    const content = getPortfolioContent("en").projects;

    render(<Projects content={content} />);

    const user = userEvent.setup();
    const wiroArticle = screen
      .getByRole("heading", { name: /wiro ai ml infrastructure platform/i })
      .closest("article");

    expect(wiroArticle).not.toBeNull();

    await user.click(within(wiroArticle as HTMLElement).getByRole("button"));

    expect(
      within(wiroArticle as HTMLElement).getByText(
        /Blazor \+ Tailwind UI for model testing/i
      )
    ).toBeInTheDocument();

    const jetlinkArticle = screen
      .getByRole("heading", { name: /jetlink multi-project chatbot platform/i })
      .closest("article");

    expect(jetlinkArticle).not.toBeNull();

    await user.click(within(jetlinkArticle as HTMLElement).getByRole("button"));

    await waitFor(() => {
      expect(
        screen.queryByText(/Blazor \+ Tailwind UI for model testing/i)
      ).not.toBeInTheDocument();
    });
    expect(
      within(jetlinkArticle as HTMLElement).getByText(
        /Windows Server and IIS deployment model/i
      )
    ).toBeInTheDocument();
  });

  it("renders the shared dossier below the active desktop row and swaps rows cleanly", async () => {
    mockViewport(true);

    const content = getPortfolioContent("en").projects;

    const { container } = render(<Projects content={content} />);
    const rows = container.querySelectorAll("[data-project-row]");

    expect(rows).toHaveLength(2);

    const user = userEvent.setup();
    await user.click(
      screen.getAllByRole("button", {
        name: new RegExp(content.expandLabel, "i"),
      })[2]
    );

    expect(rows[0]?.querySelector(".project-dossier")).toBeNull();
    expect(rows[1]?.querySelector(".project-dossier")).not.toBeNull();
    expect(screen.getByText(/gpu-enabled workloads/i)).toBeInTheDocument();

    await user.click(
      screen.getAllByRole("button", {
        name: new RegExp(content.expandLabel, "i"),
      })[0]
    );

    await waitFor(() => {
      expect(screen.queryByText(/gpu-enabled workloads/i)).not.toBeInTheDocument();
    });
    expect(rows[0]?.querySelector(".project-dossier")).not.toBeNull();
    expect(rows[1]?.querySelector(".project-dossier")).toBeNull();
    expect(
      screen.getByText(content.items[0].details?.badgeLabel ?? "")
    ).toBeInTheDocument();
    expect(screen.getByText(/MassTransit-based communication patterns/i)).toBeInTheDocument();
  });
});
