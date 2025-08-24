"use client";

import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import { ErrorFallbackProps } from "@/types";

/**
 * Error fallback for theme-related components
 * Shows minimal disruption when theme components fail
 */
function ThemeErrorFallback({ resetError }: ErrorFallbackProps) {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-background border border-red-200 dark:border-red-800 rounded-lg shadow-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-400"
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
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-foreground">
              Theme Component Error
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              A theme component failed to load. The site will continue to work
              normally.
            </p>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={resetError}
                className="text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-2 py-1 rounded hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => {
                  resetError();
                  // Hide the error after a delay
                  setTimeout(() => {
                    const element =
                      document.querySelector("[data-theme-error]");
                    if (element) {
                      element.remove();
                    }
                  }, 100);
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Error boundary for theme components that should fail gracefully
 * without disrupting the main application flow
 */
interface ThemeErrorBoundaryProps {
  children: React.ReactNode;
  componentName?: string;
}

export default function ThemeErrorBoundary({
  children,
  componentName = "Theme Component",
}: ThemeErrorBoundaryProps) {
  const handleError = (error: Error) => {
    console.warn(`Theme component error in ${componentName}:`, error.message);

    // Theme errors are non-critical, so we just log them
    // In production, you might want to track these separately
    if (process.env.NODE_ENV === "production") {
      // Example: Track non-critical theme errors
      // analytics.track('theme_component_error', {
      //   component: componentName,
      //   error: error.message
      // });
    }
  };

  return (
    <ErrorBoundary
      fallback={ThemeErrorFallback}
      onError={handleError}
      isolate={true}
    >
      <div data-theme-error>{children}</div>
    </ErrorBoundary>
  );
}
