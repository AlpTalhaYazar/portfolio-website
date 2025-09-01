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

// Helper function to check if analytics should be enabled
const isAnalyticsEnabled = (): boolean => {
  return process.env.NODE_ENV === "production";
};

// Helper function to check if gtag is available and analytics is enabled
const isGtagReady = (): boolean => {
  return (
    typeof window !== "undefined" &&
    typeof window.gtag === "function" &&
    isAnalyticsEnabled()
  );
};

// Define gtag function as a constant to prevent recreations
const gtagFunction = function gtag(...args: unknown[]) {
  // Safety check for dataLayer existence and type
  if (window.dataLayer && Array.isArray(window.dataLayer)) {
    window.dataLayer.push(args);
  }
};

export default function GoogleAnalytics({
  measurementId,
}: GoogleAnalyticsProps) {
  const initializeGA = useCallback(() => {
    // Only initialize if we have a measurement ID and analytics is enabled
    if (!measurementId || !isAnalyticsEnabled()) {
      return;
    }

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    // Create and assign gtag function if not already available
    if (!window.gtag) {
      window.gtag = gtagFunction;
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

  // Only load with valid measurement ID and when analytics is enabled
  if (!measurementId || !isAnalyticsEnabled()) {
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
export function useGoogleAnalytics(_measurementId?: string) {
  // Note: _measurementId parameter available for future extensibility
  // Currently only used for documentation and consistency

  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
    // Events are sent to the already configured GA instance, no measurement ID needed
    if (isGtagReady()) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  const trackPageView = (url: string) => {
    // Send a page_view event instead of reconfiguring GA (more efficient)
    if (isGtagReady()) {
      window.gtag("event", "page_view", {
        page_location: url,
      });
    }
  };

  return { trackEvent, trackPageView };
}
