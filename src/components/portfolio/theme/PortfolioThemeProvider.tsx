"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  PORTFOLIO_THEME_CLASS,
  PORTFOLIO_THEME_STORAGE_KEY,
  applyPortfolioTheme,
  getStoredPortfolioTheme,
  type PortfolioTheme,
} from "@/lib/portfolio/theme";

interface PortfolioThemeContextValue {
  readonly theme: PortfolioTheme;
  readonly isDark: boolean;
  readonly toggleTheme: () => void;
  readonly setTheme: (theme: PortfolioTheme) => void;
}

const PortfolioThemeContext = createContext<
  PortfolioThemeContextValue | undefined
>(undefined);

function getInitialTheme(): PortfolioTheme {
  if (typeof document !== "undefined") {
    if (
      document.documentElement.classList.contains(
        PORTFOLIO_THEME_CLASS.light
      )
    ) {
      return "light";
    }

    if (
      document.documentElement.classList.contains(
        PORTFOLIO_THEME_CLASS.dark
      )
    ) {
      return "dark";
    }
  }

  return getStoredPortfolioTheme();
}

export function PortfolioThemeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setThemeState] = useState<PortfolioTheme>(getInitialTheme);

  useEffect(() => {
    applyPortfolioTheme(theme);

    try {
      window.localStorage.setItem(PORTFOLIO_THEME_STORAGE_KEY, theme);
    } catch {
      // Storage access can fail in hardened browsers; keep the active DOM theme.
    }
  }, [theme]);

  const setTheme = useCallback((nextTheme: PortfolioTheme) => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      toggleTheme,
      setTheme,
    }),
    [setTheme, theme, toggleTheme]
  );

  return (
    <PortfolioThemeContext.Provider value={contextValue}>
      {children}
    </PortfolioThemeContext.Provider>
  );
}

export function usePortfolioTheme() {
  const context = useContext(PortfolioThemeContext);

  if (!context) {
    throw new Error(
      "usePortfolioTheme must be used within a PortfolioThemeProvider"
    );
  }

  return context;
}
