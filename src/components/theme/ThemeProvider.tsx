"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Theme, EffectiveTheme, ThemeContextValue, isTheme } from "@/types";

const ThemeProviderContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>("light");

  useEffect(() => {
    // Get theme from localStorage on mount with validation
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && isTheme(storedTheme)) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    // Update effective theme based on current theme and system preference
    const updateEffectiveTheme = () => {
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        setEffectiveTheme(systemTheme);
      } else if (theme === "matrix") {
        setEffectiveTheme("matrix");
      } else if (theme === "starwars") {
        setEffectiveTheme("starwars");
      } else {
        setEffectiveTheme(theme);
      }
    };

    updateEffectiveTheme();

    // Listen for system theme changes when using system theme
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateEffectiveTheme);
      return () =>
        mediaQuery.removeEventListener("change", updateEffectiveTheme);
    }
  }, [theme]);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove("light", "dark", "matrix", "starwars");
    root.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  const handleSetTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      theme,
      setTheme: handleSetTheme,
      effectiveTheme,
    }),
    [theme, handleSetTheme, effectiveTheme]
  );

  return (
    <ThemeProviderContext.Provider value={contextValue}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
