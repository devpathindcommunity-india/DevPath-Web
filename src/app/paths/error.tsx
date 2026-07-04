'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function PathsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Paths page error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] py-20 flex flex-col items-center justify-center px-4 text-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-destructive/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center bg-card/30 backdrop-blur-xl border border-white/10 p-10 md:p-16 rounded-[3rem] shadow-2xl">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-destructive/40 blur-[40px] rounded-full" />
          <div className="bg-background/50 p-5 rounded-3xl border border-white/10 relative z-10 backdrop-blur-sm">
            <AlertTriangle className="w-16 h-16 text-destructive animate-pulse" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black font-space mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 leading-none">
          Paths Unavailable
        </h1>

        <div className="h-1 w-20 bg-gradient-to-r from-transparent via-destructive to-transparent mb-6 rounded-full" />

        <p className="text-muted-foreground max-w-md mb-8 text-base leading-relaxed">
          {error.message ||
            "We couldn't load the learning paths. Please try again."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            aria-label="Try again"
            variant="primary"
            icon={<RotateCcw className="w-4 h-4" />}
            className="bg-destructive hover:bg-destructive/90 text-white rounded-2xl px-6 py-4"
            onClick={() => reset()}
          >
            Try Again
          </Button>
          <Link href="/" passHref>
            <Button
              aria-label="Return home"
              variant="secondary"
              icon={<Home className="w-4 h-4" />}
              className="rounded-2xl px-6 py-4 border-white/20 hover:bg-white/5"
            >
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
