'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackVisit } from '@/utils/activityTracker';

export function usePageTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) trackVisit(pathname);
  }, [pathname]);
}
