"use client";

import { useEffect, useCallback } from "react";
import Script from "next/script";

// Extend the Window interface to include gtag and dataLayer
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

interface GoogleAnalyticsProps {
  measurementId: string;
}

// Define gtag function outside component to prevent recreations
const createGtagFunction = () => {
  return function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
};

export default function GoogleAnalytics({
  measurementId,
}: GoogleAnalyticsProps) {
  const initializeGA = useCallback(() => {
    // Only initialize if we have a measurement ID and we're in production
    if (!measurementId || process.env.NODE_ENV !== "production") {
      return;
    }

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    // Create and assign gtag function if not already available
    if (!window.gtag) {
      window.gtag = createGtagFunction();
    }

    // Configure with measurement ID
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      // Modern GA4 privacy settings
      allow_google_signals: false, // Disable Google Signals for enhanced privacy
      allow_ad_personalization_signals: false, // Disable ad personalization
    });
  }, [measurementId]);

  useEffect(() => {
    initializeGA();
  }, [initializeGA]);

  // Only load in production and with valid measurement ID
  if (!measurementId || process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        async
      />
    </>
  );
}

// Custom hook for tracking events
export function useGoogleAnalytics(measurementId?: string) {
  // Get the measurement ID - prefer parameter, fallback to environment variable
  const gaId = measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
    // Events are sent to the already configured GA instance, no measurement ID needed
    if (
      typeof window !== "undefined" &&
      window.gtag &&
      process.env.NODE_ENV === "production"
    ) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  const trackPageView = (url: string) => {
    // Page views require reconfiguring GA with the measurement ID and new page path
    if (
      typeof window !== "undefined" &&
      window.gtag &&
      process.env.NODE_ENV === "production" &&
      gaId
    ) {
      window.gtag("config", gaId, {
        page_path: url,
      });
    }
  };

  return { trackEvent, trackPageView };
}
