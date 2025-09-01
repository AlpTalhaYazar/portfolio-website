"use client";

import { useEffect } from "react";
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

export default function GoogleAnalytics({
  measurementId,
}: GoogleAnalyticsProps) {
  useEffect(() => {
    // Only initialize if we have a measurement ID and we're in production
    if (!measurementId || process.env.NODE_ENV !== "production") {
      return;
    }

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    // Define gtag function
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }

    // Make gtag available globally
    window.gtag = gtag;

    // Configure with measurement ID
    gtag("js", new Date());
    gtag("config", measurementId, {
      // Privacy-friendly settings
      anonymize_ip: true,
      respect_gdpr: true,
    });
  }, [measurementId]);

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
export function useGoogleAnalytics() {
  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
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
    if (
      typeof window !== "undefined" &&
      window.gtag &&
      process.env.NODE_ENV === "production"
    ) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  };

  return { trackEvent, trackPageView };
}
