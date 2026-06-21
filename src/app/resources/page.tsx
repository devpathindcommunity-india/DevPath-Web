import React, { Suspense } from 'react';
import Resources from '@/components/home/Resources';

export default function ResourcesPage() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400 font-medium">Loading Resources...</div>}>
        <Resources />
      </Suspense>
    </main>
  );
}
