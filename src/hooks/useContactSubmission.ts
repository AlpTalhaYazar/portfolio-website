import { useState, useRef, useEffect } from "react";
import { type ContactFormData, type SecurityError } from "@/types";
import { logger } from "@/lib/logger";
import { type UseCSRFSecurityReturn } from "./useCSRFSecurity";

// Hook return type
export interface UseContactSubmissionReturn {
  // Submission state
  isSubmitted: boolean;
  submitError: string | null;
  isBlocked: boolean;
  blockInfo: { escalationLevel?: number } | null;

  // Functions
  onSubmit: (data: ContactFormData) => Promise<void>;
  clearSubmitError: () => void;
  resetSubmissionState: () => void;
}

/**
 * Custom hook for handling contact form submission
 * Manages form submission, error handling, and success states
 */
export const useContactSubmission = (
  security: UseCSRFSecurityReturn
): UseContactSubmissionReturn => {
  // Submission state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockInfo, setBlockInfo] = useState<{
    escalationLevel?: number;
  } | null>(null);

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
    setIsBlocked(false);
    setBlockInfo(null);

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
  const onSubmit = async (data: ContactFormData): Promise<void> => {
    try {
      setSubmitError(null);
      security.clearSecurityError();
      setIsBlocked(false);

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

        const tokenRefreshed = await security.fetchCSRFToken();

        if (!tokenRefreshed) {
          throw new Error(
            "Security validation failed. Please refresh the page."
          );
        }
      }

      // Prepare submission data with security token
      const submissionData = {
        ...data,
        csrfToken: security.csrfToken!,
      };

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (security.sessionId) {
        headers["x-session-id"] = security.sessionId;
      }

      const response = await fetch("/api/contact/", {
        method: "POST",
        headers,
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle enhanced rate limiting responses
        if (response.status === 429) {
          const securityResult = result as SecurityError;

          if (securityResult.blocked) {
            setIsBlocked(true);
            setBlockInfo({ escalationLevel: securityResult.escalationLevel });
          }

          const retryAfter = response.headers.get("retry-after");
          const minutes = retryAfter
            ? Math.ceil(parseInt(retryAfter) / 60)
            : 15;

          const escalationMessage = securityResult.escalationLevel
            ? ` (Level ${securityResult.escalationLevel})`
            : "";

          throw new Error(
            `Too many requests${escalationMessage}. Please wait ${minutes} minutes before trying again.`
          );
        }

        // Handle CSRF or other security errors
        if (response.status === 403) {
          // Try to refresh CSRF token for the next attempt
          await security.fetchCSRFToken();

          throw new Error(
            result.error || "Security validation failed. Please try again."
          );
        }

        throw new Error(result.error || "Failed to send message");
      }

      logger.dev.log("Email sent successfully:", result);

      setIsSubmitted(true);

      // Clear previous success timeout and set new one
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }

      successTimeoutRef.current = setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      logger.error("Error sending email:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again."
      );

      // Clear previous error timeout and set new one (10 seconds for security errors)
      if (submitErrorTimeoutRef.current) {
        clearTimeout(submitErrorTimeoutRef.current);
      }
      submitErrorTimeoutRef.current = setTimeout(
        () => setSubmitError(null),
        10000
      );
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
    isBlocked,
    blockInfo,

    // Functions
    onSubmit,
    clearSubmitError,
    resetSubmissionState,
  };
};
