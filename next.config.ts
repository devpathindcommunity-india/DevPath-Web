import type { NextConfig } from 'next';

// When running Playwright E2E tests, the dev server must not use
// `output: 'export'` because static export mode is incompatible with
// middleware and the `npm run dev` server that Playwright spins up.
const isE2E = process.env.E2E_TEST === 'true';

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
export default nextConfig;
