import { useState, useEffect, useCallback, useRef } from "react";
import { SECURITY_CONSTANTS, type CSRFTokenResponse } from "@/types";
import { logger } from "@/lib/logger";

const SECURITY_STORAGE_KEY = "portfolio.csrf-security";

interface PersistedSecurityState {
  csrfToken: string;
  sessionId: string;
  tokenExpires: number;
}

function loadPersistedSecurityState(): PersistedSecurityState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(SECURITY_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<PersistedSecurityState>;

    if (
      typeof parsedValue.csrfToken !== "string" ||
      typeof parsedValue.sessionId !== "string" ||
      typeof parsedValue.tokenExpires !== "number"
    ) {
      window.sessionStorage.removeItem(SECURITY_STORAGE_KEY);
      return null;
    }

    return {
      csrfToken: parsedValue.csrfToken,
      sessionId: parsedValue.sessionId,
      tokenExpires: parsedValue.tokenExpires,
    };
  } catch {
    window.sessionStorage.removeItem(SECURITY_STORAGE_KEY);
    return null;
  }
}

function persistSecurityState(state: PersistedSecurityState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(SECURITY_STORAGE_KEY, JSON.stringify(state));
}

function clearPersistedSecurityState(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(SECURITY_STORAGE_KEY);
}

// Hook return type
export interface UseCSRFSecurityReturn {
  // Token state
  csrfToken: string | null;
  sessionId: string | null;
  tokenExpires: number | null;

  // Loading and error states
  isSecurityLoading: boolean;
  securityError: string | null;

  // Functions
  fetchCSRFToken: () => Promise<boolean>;
  clearSecurityError: () => void;

  // Token validation helpers
  isTokenExpired: () => boolean;
  isTokenValid: () => boolean;
}

/**
 * Custom hook for managing CSRF token security
 * Handles token fetching, refreshing, and validation
 */
export const useCSRFSecurity = (): UseCSRFSecurityReturn => {
  // Security state
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [tokenExpires, setTokenExpires] = useState<number | null>(null);
  const [isSecurityLoading, setIsSecurityLoading] = useState(true);
  const [securityError, setSecurityError] = useState<string | null>(null);

  // Refs for preventing race conditions and managing state
  const isFetchingRef = useRef<boolean>(false);
  const sessionIdRef = useRef<string | null>(null);

  // Keep sessionId ref in sync with state to avoid stale closures
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  // Clear security error
  const clearSecurityError = useCallback(() => {
    setSecurityError(null);
  }, []);

  // Check if token is expired
  const isTokenExpired = useCallback((): boolean => {
    if (!tokenExpires) return true;
    const now = Date.now();
    return now >= tokenExpires - SECURITY_CONSTANTS.CSRF_REFRESH_THRESHOLD;
  }, [tokenExpires]);

  // Check if token is valid (exists and not expired)
  const isTokenValid = useCallback((): boolean => {
    return !!(csrfToken && sessionId && !isTokenExpired());
  }, [csrfToken, sessionId, isTokenExpired]);

  // CSRF Token fetching function
  const fetchCSRFToken = useCallback(async (): Promise<boolean> => {
    // Prevent multiple simultaneous calls
    if (isFetchingRef.current) {
      logger.dev.log("CSRF token fetch already in progress, skipping...");
      return false;
    }

    try {
      isFetchingRef.current = true;
      setIsSecurityLoading(true);
      setSecurityError(null);

      logger.dev.log("Fetching CSRF token...");

      const headers: Record<string, string> = {};
      // Use ref to get current sessionId value (avoids stale closure)
      const currentSessionId = sessionIdRef.current;
      if (currentSessionId) {
        headers["x-session-id"] = currentSessionId;
        logger.dev.log("Using existing session ID for token refresh");
      } else {
        logger.dev.log("Generating new session ID");
      }

      const response = await fetch("/api/csrf-token/", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get security token");
      }

      const data: CSRFTokenResponse = await response.json();

      logger.dev.log(
        "CSRF token fetched successfully, expires:",
        new Date(data.expires)
      );

      setCsrfToken(data.token);
      setSessionId(data.sessionId);
      setTokenExpires(data.expires);
      persistSecurityState({
        csrfToken: data.token,
        sessionId: data.sessionId,
        tokenExpires: data.expires,
      });
      setIsSecurityLoading(false);

      return true;
    } catch (error) {
      logger.error("Failed to fetch CSRF token:", error);

      setSecurityError(
        error instanceof Error
          ? error.message
          : "Security initialization failed"
      );
      clearPersistedSecurityState();

      setIsSecurityLoading(false);
      return false;
    } finally {
      isFetchingRef.current = false;
    }
  }, []); // Empty dependency array: all relevant dynamic state values are accessed via refs to avoid stale closures; other values (setters, logger) are stable

  // Initialize security on hook mount
  useEffect(() => {
    const initializeSecurity = async () => {
      // Prevent multiple simultaneous calls
      if (isFetchingRef.current) {
        logger.dev.log(
          "Security initialization already in progress, skipping..."
        );
        return;
      }

      try {
        const persistedState = loadPersistedSecurityState();

        if (persistedState) {
          sessionIdRef.current = persistedState.sessionId;
          setCsrfToken(persistedState.csrfToken);
          setSessionId(persistedState.sessionId);
          setTokenExpires(persistedState.tokenExpires);

          if (
            persistedState.tokenExpires >
            Date.now() + SECURITY_CONSTANTS.CSRF_REFRESH_THRESHOLD
          ) {
            logger.dev.log("Reusing persisted CSRF token from session storage");
            setIsSecurityLoading(false);
            return;
          }
        }

        isFetchingRef.current = true;
        setIsSecurityLoading(true);
        setSecurityError(null);

        logger.dev.log("Initializing security...");

        const headers: Record<string, string> = {};
        // Use ref to get current sessionId value (avoids stale closure)
        const currentSessionId = sessionIdRef.current;
        if (currentSessionId) {
          headers["x-session-id"] = currentSessionId;
          logger.dev.log("Using existing session ID for initialization");
        } else {
          logger.dev.log("Generating new session ID");
        }

        const response = await fetch("/api/csrf-token/", {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to get security token");
        }

        const data: CSRFTokenResponse = await response.json();

        logger.dev.log(
          "Security initialized successfully, expires:",
          new Date(data.expires)
        );

        setCsrfToken(data.token);
        setSessionId(data.sessionId);
        setTokenExpires(data.expires);
        persistSecurityState({
          csrfToken: data.token,
          sessionId: data.sessionId,
          tokenExpires: data.expires,
        });
        setIsSecurityLoading(false);
      } catch (error) {
        logger.error("Failed to initialize security:", error);

        setSecurityError(
          error instanceof Error
            ? error.message
            : "Security initialization failed"
        );
        clearPersistedSecurityState();

        setIsSecurityLoading(false);
      } finally {
        isFetchingRef.current = false;
      }
    };

    initializeSecurity();
  }, []); // No dependencies: refs are used to avoid stale closure issues

  return {
    // Token state
    csrfToken,
    sessionId,
    tokenExpires,

    // Loading and error states
    isSecurityLoading,
    securityError,

    // Functions
    fetchCSRFToken,
    clearSecurityError,

    // Token validation helpers
    isTokenExpired,
    isTokenValid,
  };
};
