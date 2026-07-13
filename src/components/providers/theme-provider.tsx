'use client';

import * as React from 'react';
import { type ThemeProviderProps } from 'next-themes';
import { useUIStore, type ThemePreference } from '@/stores/ui-store';

// Mock context for next-themes to avoid script tag injection errors in React 19
// Since the app is now forced to light mode only.
const ThemeContext = React.createContext({
  theme: 'light',
  resolvedTheme: 'light',
  setTheme: (_: string) => {},
});

export const useTheme = () => React.useContext(ThemeContext);

function ThemeStoreBridge() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const syncTheme = useUIStore((state) => state.syncTheme);
  const setThemeApplier = useUIStore((state) => state.setThemeApplier);

  React.useEffect(() => {
    syncTheme(theme, resolvedTheme);
  }, [resolvedTheme, syncTheme, theme]);

  React.useEffect(() => {
    setThemeApplier((nextTheme: ThemePreference) => setTheme(nextTheme));
  }, [setTheme, setThemeApplier]);

  return null;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={{ theme: 'light', resolvedTheme: 'light', setTheme: () => {} }}>
      <ThemeStoreBridge />
      <div className="light">{children}</div>
    </ThemeContext.Provider>
  );
}
