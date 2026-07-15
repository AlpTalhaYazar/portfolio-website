import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  ANALYTICS_CONSENT_POLICY_VERSION,
  ANALYTICS_CONSENT_STORAGE_KEY,
} from "@/lib/analytics/consent";
import {
  AnalyticsConsentProvider,
  useAnalyticsConsent,
} from "./AnalyticsConsentProvider";

vi.mock("@next/third-parties/google", () => ({
  GoogleAnalytics: ({ gaId }: { gaId: string }) => (
    <div data-testid="google-analytics" data-measurement-id={gaId} />
  ),
}));

function PreferenceHarness() {
  const { openPreferences, withdrawConsent } = useAnalyticsConsent();

  return (
    <>
      <button type="button" onClick={openPreferences}>
        Open preferences
      </button>
      <button type="button" onClick={withdrawConsent}>
        Withdraw
      </button>
    </>
  );
}

function renderProvider() {
  return render(
    <AnalyticsConsentProvider locale="en" measurementId="G-TEST123">
      <PreferenceHarness />
    </AnalyticsConsentProvider>
  );
}

describe("AnalyticsConsentProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    delete window.dataLayer;
    delete window.gtag;
    delete window["ga-disable-G-TEST123"];
  });

  it("does not render Analytics before an explicit choice", async () => {
    renderProvider();

    expect(screen.queryByTestId("google-analytics")).not.toBeInTheDocument();
    expect(
      await screen.findByRole("region", { name: "Analytics preferences" })
    ).toBeVisible();
    expect(screen.queryByTestId("google-analytics")).not.toBeInTheDocument();
  });

  it("keeps Analytics absent after rejection and persists the choice", async () => {
    renderProvider();
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button", { name: "Reject analytics" }));

    expect(screen.queryByTestId("google-analytics")).not.toBeInTheDocument();
    expect(localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toContain(
      '"decision":"rejected"'
    );
  });

  it("loads Analytics once after acceptance and grants analytics storage only", async () => {
    renderProvider();
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button", { name: "Accept analytics" }));

    expect(screen.getAllByTestId("google-analytics")).toHaveLength(1);
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          0: "consent",
          1: "update",
          2: expect.objectContaining({
            analytics_storage: "granted",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
          }),
        }),
      ])
    );
  });

  it("honors a current persisted acceptance without prompting", async () => {
    localStorage.setItem(
      ANALYTICS_CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: ANALYTICS_CONSENT_POLICY_VERSION,
        decision: "accepted",
        updatedAt: new Date().toISOString(),
      })
    );

    renderProvider();

    expect(await screen.findByTestId("google-analytics")).toBeVisible();
    expect(screen.queryByRole("region", { name: "Analytics preferences" })).not.toBeInTheDocument();
  });

  it("re-prompts after a policy-version change", async () => {
    localStorage.setItem(
      ANALYTICS_CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: ANALYTICS_CONSENT_POLICY_VERSION - 1,
        decision: "accepted",
        updatedAt: new Date().toISOString(),
      })
    );

    renderProvider();

    expect(
      await screen.findByRole("region", { name: "Analytics preferences" })
    ).toBeVisible();
    expect(screen.queryByTestId("google-analytics")).not.toBeInTheDocument();
  });

  it("withdraws consent, disables collection, and keeps preferences reopenable", async () => {
    renderProvider();
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: "Accept analytics" }));

    await user.click(screen.getByRole("button", { name: "Withdraw" }));

    await waitFor(() =>
      expect(screen.queryByTestId("google-analytics")).not.toBeInTheDocument()
    );
    expect(window["ga-disable-G-TEST123"]).toBe(true);
    expect(localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toContain(
      '"decision":"rejected"'
    );

    await user.click(screen.getByRole("button", { name: "Open preferences" }));
    expect(
      screen.getByRole("dialog", { name: "Analytics preferences" })
    ).toBeVisible();
  });

  it("contains modal keyboard focus and restores it after Escape", async () => {
    renderProvider();
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: "Reject analytics" }));

    const trigger = screen.getByRole("button", { name: "Open preferences" });
    await user.click(trigger);

    expect(screen.getByRole("button", { name: "Close preferences" })).toHaveFocus();

    const privacyLink = screen.getByRole("link", {
      name: "Read privacy information",
    });
    const acceptButton = screen.getByRole("button", { name: "Accept analytics" });

    acceptButton.focus();
    await user.tab();
    expect(privacyLink).toHaveFocus();

    await user.tab({ shift: true });
    expect(acceptButton).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("dialog", { name: "Analytics preferences" })
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
