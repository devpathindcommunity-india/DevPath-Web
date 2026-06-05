'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NotFoundView from '@/components/layout/NotFoundView';

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith('/u/')) {
      const parts = pathname.slice(3).split('/');
      const uid = parts[0]?.split('?')[0];
      if (uid && uid !== 'dummy' && uid !== '') {
        setIsRedirecting(true);
        router.replace(`/u?uid=${uid}`);
      }
    }
  }, [pathname, router]);

  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <NotFoundView />;
}
