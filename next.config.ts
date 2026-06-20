import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

// When running Playwright E2E tests, the dev server must not use
// `output: 'export'` because static export mode is incompatible with
// middleware and the `npm run dev` server that Playwright spins up.
const isE2E = process.env.E2E_TEST === 'true';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  reloadOnOnline: true,
  cacheOnFrontEndNav: true,
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
        handler: 'NetworkFirst',
        options: {
          cacheName: 'apis',
          expiration: {
            maxEntries: 16,
            maxAgeSeconds: 24 * 60 * 60,
          },
          networkTimeoutSeconds: 10,
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  ...(isE2E ? {} : { output: 'export' }),
  devIndicators: {
    // @ts-ignore - buildActivity is valid but missing in type definition
    buildActivity: false,
    // @ts-ignore - appIsrStatus is valid but missing in type definition
    appIsrStatus: false,
  },
  reactCompiler: false,

  images: {
    unoptimized: true,
  },
};

export default withPWA(nextConfig);
