import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  // Run tests sequentially — prevents the dev server from being overwhelmed
  // by 8 simultaneous requests before it has finished warming up.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    // Use domcontentloaded so tests don't wait for Firebase/Firestore
    // connections (which may hang indefinitely with mock credentials).
    navigationTimeout: 60000,
    actionTimeout: 15000,
  },
  // Global per-test timeout
  timeout: 60000,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // E2E_TEST=true disables `output: 'export'` in next.config.ts so that
    // the dev server can run with middleware support.
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      NEXT_PUBLIC_E2E_TEST: 'true',
      E2E_TEST: 'true',
    },
  },
});
