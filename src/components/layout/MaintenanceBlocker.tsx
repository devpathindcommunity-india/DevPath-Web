'use client';

import { useMaintenance } from '@/hooks/useMaintenance';
import { useAuth } from '@/context/AuthContext';
import MaintenanceOverlay from '@/components/layout/MaintenanceOverlay';

export default function MaintenanceBlocker({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMaintenanceMode, loading: maintenanceLoading } = useMaintenance();
  const { user, isLoading: authLoading } = useAuth();

  const isLoading = maintenanceLoading || authLoading;

  // If maintenance is ON and user is NOT an admin, BLOCK THEM.
  if (!isLoading && isMaintenanceMode && !(user as any)?.isAdmin) {
    return <MaintenanceOverlay />;
  }

  return (
    <div
      className={isLoading ? 'opacity-0 pointer-events-none' : ''}
      aria-hidden={isLoading}
    >
      {children}
    </div>
  );
}
