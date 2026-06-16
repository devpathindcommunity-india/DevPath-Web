'use client';

import { useEffect, useState } from 'react';

/**
 * React hook that reactively tracks the user's `prefers-reduced-motion`
 * OS setting. Updates in real-time if the user changes their OS preference
 * while the page is open.
 *
 * @returns boolean — true if user prefers reduced motion
 *
 * Usage:
 *   const shouldReduceMotion = useReducedMotion();
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    // SSR-safe: default to false on server
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    // Modern API
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return reducedMotion;
}
