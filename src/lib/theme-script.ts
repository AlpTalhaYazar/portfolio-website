// This script runs before React hydration to prevent FOUC (Flash of Unstyled Content)
export const themeScript = `
  try {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    // Fallback to light theme if anything goes wrong
    document.documentElement.classList.add('light');
  }
`;
