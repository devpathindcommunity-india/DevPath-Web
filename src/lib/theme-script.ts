/**
 * Theme initialization script that prevents flash-of-incorrect-theme
 * This script runs BEFORE hydration to apply saved theme preference immediately
 * 
 * Integration: Inject as an inline script in layout.tsx <head> before any styles load
 */

export function getThemeInitScript(): string {
  return `
    (function() {
      try {
        // Get saved theme from localStorage
        const savedTheme = localStorage.getItem('theme');
        
        // Get system preference as fallback
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Determine theme: saved > system > default (dark)
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        // Apply theme immediately before rendering
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        // Store for next-themes to detect
        localStorage.setItem('theme', theme);
      } catch (e) {
        // Fallback to dark if localStorage is unavailable
        document.documentElement.classList.add('dark');
      }
    })();
  `;
}
