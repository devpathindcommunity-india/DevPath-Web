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
  // Always initialize to false to match the server render and avoid hydration mismatch
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value once mounted on client
    setReducedMotion(mediaQuery.matches);

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
