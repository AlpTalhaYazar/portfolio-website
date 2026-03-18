import {
  PORTFOLIO_THEME_CLASS,
  PORTFOLIO_THEME_COLOR,
  PORTFOLIO_THEME_STORAGE_KEY,
} from "./theme";

export const portfolioThemeScript = `
(function() {
  try {
    var storedTheme = window.localStorage.getItem(${JSON.stringify(PORTFOLIO_THEME_STORAGE_KEY)});
    var theme = storedTheme === "light" ? "light" : "dark";
    var root = document.documentElement;
    root.classList.remove(${JSON.stringify(PORTFOLIO_THEME_CLASS.dark)}, ${JSON.stringify(PORTFOLIO_THEME_CLASS.light)});
    root.classList.add(theme === "light" ? ${JSON.stringify(PORTFOLIO_THEME_CLASS.light)} : ${JSON.stringify(PORTFOLIO_THEME_CLASS.dark)});
    root.style.colorScheme = theme;
    var themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", theme === "light" ? ${JSON.stringify(PORTFOLIO_THEME_COLOR.light)} : ${JSON.stringify(PORTFOLIO_THEME_COLOR.dark)});
    }
  } catch {
    var root = document.documentElement;
    root.classList.remove(${JSON.stringify(PORTFOLIO_THEME_CLASS.light)});
    root.classList.add(${JSON.stringify(PORTFOLIO_THEME_CLASS.dark)});
    root.style.colorScheme = "dark";
    var themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", ${JSON.stringify(PORTFOLIO_THEME_COLOR.dark)});
    }
  }
})();
`;
