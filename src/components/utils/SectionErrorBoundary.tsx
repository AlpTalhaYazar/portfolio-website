"use client";

import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import { ErrorFallbackProps } from "@/types";

/**
 * Error fallback specifically designed for section components
 */
function SectionErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-4">
          Section Temporarily Unavailable
        </h2>

        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          This section encountered an issue and couldn't load properly. You can
          try reloading it or continue browsing other sections.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetError}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Retry Section
          </button>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 border border-border text-base font-medium rounded-md text-foreground bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Page
          </button>
        </div>

        {process.env.NODE_ENV === "development" && error && (
          <details className="mt-8 text-left max-w-2xl mx-auto">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground mb-2">
              Error details (development only)
            </summary>
            <div className="bg-muted rounded-lg p-4 text-xs font-mono overflow-auto">
              <div className="mb-2 font-semibold text-red-600 dark:text-red-400">
                {error.name}: {error.message}
              </div>
              <pre className="whitespace-pre-wrap text-muted-foreground">
                {error.stack}
              </pre>
            </div>
          </details>
        )}
      </div>
    </section>
  );
}

/**
 * Error boundary specifically for section components
 */
interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  sectionName?: string;
}

export default function SectionErrorBoundary({
  children,
  sectionName = "Unknown Section",
}: SectionErrorBoundaryProps) {
  const handleError = (error: Error) => {
    // Log section-specific errors
    console.error(`Error in ${sectionName}:`, error);

    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error, { section: sectionName });
    }
  };

  return (
    <ErrorBoundary
      fallback={SectionErrorFallback}
      onError={handleError}
      isolate={true}
    >
      {children}
    </ErrorBoundary>
  );
}
