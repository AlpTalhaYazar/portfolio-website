export type PortfolioTheme = "dark" | "light";

export const PORTFOLIO_THEME_STORAGE_KEY = "aty-theme";

export const PORTFOLIO_THEME_CLASS: Record<PortfolioTheme, string> = {
  dark: "dark-theme",
  light: "light-theme",
};

export const PORTFOLIO_THEME_COLOR: Record<PortfolioTheme, string> = {
  dark: "#080808",
  light: "#F4F2ED",
};

export function isPortfolioTheme(value: unknown): value is PortfolioTheme {
  return value === "dark" || value === "light";
}

export function getStoredPortfolioTheme(): PortfolioTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const storedTheme = window.localStorage.getItem(PORTFOLIO_THEME_STORAGE_KEY);
    return isPortfolioTheme(storedTheme) ? storedTheme : "light";
  } catch {
    return "light";
  }
}

export function applyPortfolioTheme(
  theme: PortfolioTheme,
  doc: Document = document
) {
  const root = doc.documentElement;

  root.classList.remove(
    PORTFOLIO_THEME_CLASS.dark,
    PORTFOLIO_THEME_CLASS.light
  );
  root.classList.add(PORTFOLIO_THEME_CLASS[theme]);
  root.style.colorScheme = theme;

  const themeColorMeta = doc.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", PORTFOLIO_THEME_COLOR[theme]);
  }
}
