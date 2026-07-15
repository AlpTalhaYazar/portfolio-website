import { useState, useRef, useEffect } from "react";
import { type ContactFormData } from "@/types";
import { logger } from "@/lib/logger";
import { type UseCSRFSecurityReturn } from "./useCSRFSecurity";

// Hook return type
export interface UseContactSubmissionReturn {
  // Submission state
  isSubmitted: boolean;
  submitError: string | null;

  // Functions
  onSubmit: (data: ContactFormData) => Promise<boolean>;
  clearSubmitError: () => void;
  resetSubmissionState: () => void;
}

export interface ContactSubmissionMessages {
  readonly security: string;
  readonly rateLimited: string;
  readonly unavailable: string;
  readonly failed: string;
}

const DEFAULT_MESSAGES: ContactSubmissionMessages = {
  security: "Security validation failed. Please try again.",
  rateLimited: "Too many requests. Please wait {minutes} minutes before trying again.",
  unavailable: "The contact service is temporarily unavailable. Please try again later.",
  failed: "Failed to send message. Please try again.",
};

/**
 * Custom hook for handling contact form submission
 * Manages form submission, error handling, and success states
 */
export const useContactSubmission = (
  security: UseCSRFSecurityReturn,
  messages: ContactSubmissionMessages = DEFAULT_MESSAGES
): UseContactSubmissionReturn => {
  // Submission state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Refs for timeout management
  const submitErrorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear submit error
  const clearSubmitError = () => {
    setSubmitError(null);
    if (submitErrorTimeoutRef.current) {
      clearTimeout(submitErrorTimeoutRef.current);
      submitErrorTimeoutRef.current = null;
    }
  };

  // Reset all submission states
  const resetSubmissionState = () => {
    setIsSubmitted(false);
    setSubmitError(null);

    // Clear any active timeouts
    if (submitErrorTimeoutRef.current) {
      clearTimeout(submitErrorTimeoutRef.current);
      submitErrorTimeoutRef.current = null;
    }
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
  };

  // Form submission handler
  const onSubmit = async (data: ContactFormData): Promise<boolean> => {
    try {
      setSubmitError(null);
      security.clearSecurityError();

      let csrfToken = security.csrfToken;
      let sessionId = security.sessionId;

      // Ensure we have a valid CSRF token
      if (!security.isTokenValid()) {
        logger.dev.log("Refreshing CSRF token before form submission", {
          hasToken: !!security.csrfToken,
          hasSession: !!security.sessionId,
          isExpired: security.isTokenExpired(),
          tokenExpires: security.tokenExpires
            ? new Date(security.tokenExpires)
            : null,
        });

        const refreshedCredential = await security.fetchCSRFToken();

        if (!refreshedCredential) {
          throw new Error(messages.security);
        }

        csrfToken = refreshedCredential.token;
        sessionId = refreshedCredential.sessionId;
      }

      if (!csrfToken || !sessionId) {
        throw new Error(messages.security);
      }

      // Prepare submission data with security token
      const submissionData = {
        ...data,
        csrfToken,
      };

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      headers["x-session-id"] = sessionId;

      const response = await fetch("/api/contact/", {
        method: "POST",
        headers,
        body: JSON.stringify(submissionData),
      });

      let result: { code?: string } = {};
      try {
        result = (await response.json()) as { code?: string };
      } catch {
        result = {};
      }

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = response.headers.get("retry-after");
          const retrySeconds = retryAfter
            ? Number.parseInt(retryAfter, 10)
            : Number.NaN;
          const minutes = Number.isFinite(retrySeconds)
            ? Math.max(1, Math.ceil(retrySeconds / 60))
            : 15;
          throw new Error(
            messages.rateLimited.replace("{minutes}", String(minutes))
          );
        }

        // Handle CSRF or other security errors
        if (response.status === 403) {
          // Try to refresh CSRF token for the next attempt
          await security.fetchCSRFToken();

          throw new Error(messages.security);
        }

        if (response.status === 503) {
          throw new Error(messages.unavailable);
        }

        throw new Error(messages.failed);
      }

      logger.dev.log("contact_submission_succeeded", { code: result.code });

      setIsSubmitted(true);

      // Clear previous success timeout and set new one
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }

      successTimeoutRef.current = setTimeout(() => setIsSubmitted(false), 5000);
      return true;
    } catch (error) {
      logger.error("Error sending email:", error);

      setSubmitError(error instanceof Error ? error.message : messages.failed);

      // Clear previous error timeout and set new one (10 seconds for security errors)
      if (submitErrorTimeoutRef.current) {
        clearTimeout(submitErrorTimeoutRef.current);
      }
      submitErrorTimeoutRef.current = setTimeout(
        () => setSubmitError(null),
        10000
      );
      return false;
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (submitErrorTimeoutRef.current) {
        clearTimeout(submitErrorTimeoutRef.current);
      }
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Submission state
    isSubmitted,
    submitError,

    // Functions
    onSubmit,
    clearSubmitError,
    resetSubmissionState,
  };
};
