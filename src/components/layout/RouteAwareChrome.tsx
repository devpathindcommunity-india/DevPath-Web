'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import MaintenanceBlocker from '@/components/layout/MaintenanceBlocker';
import MaintenanceBanner from '@/components/layout/MaintenanceBanner';
import OfflineBanner from '@/components/layout/OfflineBanner';
import Navbar from '@/components/layout/Navbar';
import FooterWrapper from '@/components/layout/FooterWrapper';
import PageWrapper from '@/components/layout/PageWrapper';
import { FloatingAssistant } from '@/components/assistant/floating-assistant';
import { ToastContainer } from '@/components/ui/ToastContainer';
import SearchModal from '@/components/layout/SearchModal';
import ShortcutLegend from '@/components/layout/ShortcutLegend';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import BackToTop from '@/components/BackToTop';

export default function RouteAwareChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthRoute = pathname === '/login' || pathname === '/signup';
  const [isLegendOpen, setLegendOpen] = useState(false);

  useKeyboardShortcuts({
    '?': () => setLegendOpen((prev) => !prev),
    escape: () => setLegendOpen(false),
  });

  return (
    <>
      <OfflineBanner />
      {!isAuthRoute && <MaintenanceBanner />}
      <Navbar />

      <MaintenanceBlocker>
        <PageWrapper>{children}</PageWrapper>
      </MaintenanceBlocker>

      {!isAuthRoute && <FooterWrapper />}
      {!isAuthRoute && <FloatingAssistant />}
      {!isAuthRoute && <BackToTop />}
      <ToastContainer />
      <SearchModal />
      <ShortcutLegend
        isOpen={isLegendOpen}
        onClose={() => setLegendOpen(false)}
      />
    </>
  );
}