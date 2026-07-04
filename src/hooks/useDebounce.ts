import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Har keystroke par ek timer set hota hai
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Agar user delay se pehle dobara type karta hai, toh pichla timer cancel (cleanup) ho jata hai
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-call effect if value or delay changes

  return debouncedValue;
}

export default useDebounce;
