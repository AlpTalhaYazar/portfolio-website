// This script runs before React hydration to prevent FOUC (Flash of Unstyled Content)
// Enhanced security: No inline scripts, proper theme handling
export const themeScript = `
(function() {
  'use strict';
  
  try {
    const theme = localStorage.getItem('theme');
    const root = document.documentElement;
    
    // Clear all theme classes first
    root.classList.remove('light', 'dark', 'matrix', 'starwars');
    
    // Apply appropriate theme class
    if (theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) || 
        (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else if (theme === 'matrix') {
      root.classList.add('matrix');
    } else if (theme === 'starwars') {
      root.classList.add('starwars');
    } else {
      root.classList.add('light');
    }
  } catch (error) {
    // Secure fallback to light theme if anything goes wrong
    document.documentElement.classList.add('light');
    console.warn('Theme initialization failed, falling back to light theme:', error);
  }
})();
`;
