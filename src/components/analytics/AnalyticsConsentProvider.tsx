"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  readAnalyticsConsent,
  writeAnalyticsConsent,
  type AnalyticsConsentDecision,
} from "@/lib/analytics/consent";
import { buildLocalizedHref } from "@/lib/i18n/routing";
import type { PortfolioLocale } from "@/types/portfolio";
import { analyticsConsentCopy } from "./copy";

interface AnalyticsConsentContextValue {
  readonly decision: AnalyticsConsentDecision | null;
  readonly isAvailable: boolean;
  readonly openPreferences: () => void;
  readonly withdrawConsent: () => void;
}

const AnalyticsConsentContext = createContext<
  AnalyticsConsentContextValue | undefined
>(undefined);

function applyGoogleConsent(
  measurementId: string,
  granted: boolean
): void {
  window.dataLayer ??= [];
  window.gtag ??= (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };

  window[`ga-disable-${measurementId}`] = !granted;
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function AnalyticsConsentProvider({
  children,
  locale,
  measurementId,
}: Readonly<{
  children: React.ReactNode;
  locale: PortfolioLocale;
  measurementId?: string;
}>) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [decision, setDecision] = useState<AnalyticsConsentDecision | null>(
    null
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const preferencesTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const preference = readAnalyticsConsent();
    if (measurementId && preference) {
      applyGoogleConsent(measurementId, preference.decision === "accepted");
      setDecision(preference.decision);
    }
    setIsHydrated(true);
  }, [measurementId]);

  const choose = useCallback(
    (nextDecision: AnalyticsConsentDecision) => {
      if (measurementId) {
        applyGoogleConsent(measurementId, nextDecision === "accepted");
      }
      writeAnalyticsConsent(nextDecision);
      setDecision(nextDecision);
      setPreferencesOpen(false);
    },
    [measurementId]
  );

  const openPreferences = useCallback(() => {
    if (!measurementId) return;

    if (document.activeElement instanceof HTMLElement) {
      preferencesTriggerRef.current = document.activeElement;
    }
    setPreferencesOpen(true);
  }, [measurementId]);

  useEffect(() => {
    if (preferencesOpen || !preferencesTriggerRef.current) return;

    const trigger = preferencesTriggerRef.current;
    preferencesTriggerRef.current = null;
    trigger.focus();
  }, [preferencesOpen]);

  const withdrawConsent = useCallback(() => {
    choose("rejected");
  }, [choose]);

  const contextValue = useMemo(
    () => ({
      decision,
      isAvailable: Boolean(measurementId),
      openPreferences,
      withdrawConsent,
    }),
    [decision, measurementId, openPreferences, withdrawConsent]
  );

  const shouldShowPanel =
    Boolean(measurementId) && isHydrated && (decision === null || preferencesOpen);

  return (
    <AnalyticsConsentContext.Provider value={contextValue}>
      {children}
      {measurementId && decision === "accepted" ? (
        <GoogleAnalytics gaId={measurementId} />
      ) : null}
      {shouldShowPanel ? (
        <AnalyticsConsentPanel
          locale={locale}
          isPreferences={preferencesOpen}
          onAccept={() => choose("accepted")}
          onReject={() => choose("rejected")}
          onClose={() => setPreferencesOpen(false)}
        />
      ) : null}
    </AnalyticsConsentContext.Provider>
  );
}

function AnalyticsConsentPanel({
  locale,
  isPreferences,
  onAccept,
  onReject,
  onClose,
}: {
  locale: PortfolioLocale;
  isPreferences: boolean;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
}) {
  const copy = analyticsConsentCopy[locale];
  const titleId = "analytics-consent-title";
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isPreferences) return;

    const previousOverflow = document.body.style.overflow;
    const backgroundElements = Array.from(
      document.querySelectorAll<HTMLElement>(".skip-link, header, main, footer")
    );
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
  }, [isPreferences]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isPreferences) return;

    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) ?? []
    ).filter((element) => !element.hasAttribute("hidden"));

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      ref={panelRef}
      role={isPreferences ? "dialog" : "region"}
      aria-modal={isPreferences ? "true" : undefined}
      aria-labelledby={titleId}
      onKeyDown={handleKeyDown}
      className="fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-3xl rounded-[1.75rem] border border-border-strong bg-surface-2 p-5 shadow-2xl sm:inset-x-8 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl space-y-2">
          <h2 id={titleId} className="text-lg font-semibold text-foreground">
            {copy.title}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {copy.description}
          </p>
          <Link
            href={buildLocalizedHref(locale, "/privacy")}
            className="inline-flex text-sm font-medium text-accent underline underline-offset-4"
          >
            {copy.privacy}
          </Link>
        </div>
        {isPreferences ? (
          <button
            ref={closeButtonRef}
            type="button"
            aria-label={copy.close}
            className="secondary-button self-start px-4 py-2"
            onClick={onClose}
          >
            ×
          </button>
        ) : null}
      </div>
      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" className="secondary-button justify-center" onClick={onReject}>
          {copy.reject}
        </button>
        <button type="button" className="primary-button justify-center" onClick={onAccept}>
          {copy.accept}
        </button>
      </div>
    </div>
  );
}

export function useAnalyticsConsent(): AnalyticsConsentContextValue {
  const context = useContext(AnalyticsConsentContext);
  if (!context) {
    throw new Error(
      "useAnalyticsConsent must be used within AnalyticsConsentProvider"
    );
  }
  return context;
}
