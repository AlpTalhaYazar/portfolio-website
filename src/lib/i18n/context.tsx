"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  Language,
  languages,
  defaultLanguage,
  getLanguageFromSources,
  saveLanguagePreference,
  isValidLanguage,
} from "./config";
import { getTranslation } from "./translations";
import type { TranslationPath, TranslationReturnType } from "./types";
import { createTranslationProxy, type TranslationProxy } from "./proxy";

// Context type
interface I18nContextValue {
  readonly language: Language;
  readonly setLanguage: (language: Language) => void;
  readonly t: TranslationProxy;
  readonly tFunc: <P extends TranslationPath>(
    path: P
  ) => TranslationReturnType<P>;
  readonly languages: typeof languages;
  readonly isLoading: boolean;
}

// Create context
const I18nContext = createContext<I18nContextValue | undefined>(undefined);

// Custom hook to use the i18n context
export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}

// Convenience hooks
export function useLanguage() {
  const { language, setLanguage, languages } = useTranslation();
  return { language, setLanguage, languages };
}

export function useT() {
  const { t } = useTranslation();
  return t;
}

// Specific hooks for array and string translations
export function useTranslationArray<P extends TranslationPath>(
  path: P
): string[] {
  const { tFunc } = useTranslation();
  const result = tFunc(path);
  return Array.isArray(result) ? result : [result as string];
}

export function useTranslationString<P extends TranslationPath>(
  path: P
): string {
  const { tFunc } = useTranslation();
  const result = tFunc(path);
  if (Array.isArray(result)) {
    return (result as string[]).join(" ");
  }
  return result as string;
}

// Provider props
interface I18nProviderProps {
  children: React.ReactNode;
  initialLanguage?: Language;
}

// I18n Provider component
export function I18nProvider({ children, initialLanguage }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(
    initialLanguage || defaultLanguage
  );
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const detectedLanguage = getLanguageFromSources();
      setLanguageState(detectedLanguage);
    }
    setIsLoading(false);
  }, []);

  // Translation function with memoization
  const tFunc = useCallback(
    <P extends TranslationPath>(path: P): TranslationReturnType<P> => {
      return getTranslation(language, path);
    },
    [language]
  );

  // Create proxy-based translation object
  const t = useMemo(() => {
    try {
      return createTranslationProxy(language);
    } catch (error) {
      console.warn("Failed to create translation proxy:", error);
      // Fallback to an empty proxy that will use tFunc
      return new Proxy({} as TranslationProxy, {
        get(target, prop) {
          if (typeof prop === "string") {
            return tFunc(prop as TranslationPath);
          }
          return undefined;
        },
      });
    }
  }, [language, tFunc]);

  // Language setter with persistence
  const setLanguage = useCallback((newLanguage: Language) => {
    if (!isValidLanguage(newLanguage)) {
      console.warn(
        `Invalid language: ${newLanguage}. Falling back to ${defaultLanguage}`
      );
      return;
    }

    setLanguageState(newLanguage);
    saveLanguagePreference(newLanguage);

    // Update document language attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLanguage;
    }

    // Announce language change for screen readers
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const announcement = `Language changed to ${languages[newLanguage].name}`;
      const utterance = new SpeechSynthesisUtterance(announcement);
      utterance.volume = 0; // Silent announcement
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      tFunc,
      languages,
      isLoading,
    }),
    [language, setLanguage, t, tFunc, isLoading]
  );

  // Update document attributes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir = languages[language].dir;
    }
  }, [language]);

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
}

// HOC for components that need translation
export function withTranslation<P extends object>(
  Component: React.ComponentType<P & { t: I18nContextValue["t"] }>
) {
  const WrappedComponent = (props: P) => {
    const { t } = useTranslation();
    return <Component {...props} t={t} />;
  };

  WrappedComponent.displayName = `withTranslation(${
    Component.displayName || Component.name
  })`;
  return WrappedComponent;
}

// Error boundary for i18n-related errors
export class I18nErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("I18n Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 text-center">
            <p>Translation system error. Please refresh the page.</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Export types
export type { I18nContextValue, Language };

// Utility component for debugging translations
export function TranslationDebugger() {
  const { language, languages } = useTranslation();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-2 rounded text-xs">
      <div>
        Current Language: {language} ({languages[language].name})
      </div>
      <div>Direction: {languages[language].dir}</div>
    </div>
  );
}
