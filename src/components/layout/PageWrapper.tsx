'use client';

import { usePathname } from 'next/navigation';

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  return (
    <main
      style={{
        position: 'relative',
        paddingTop: isHome ? 0 : isAuthRoute ? '72px' : '150px',
      }}
    >
      {children}
    </main>
  );
}
