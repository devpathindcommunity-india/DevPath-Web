import { test, expect } from '@playwright/test';

/**
 * E2E tests for Roadmap navigation
 *
 * Strategy:
 * - The /paths page shows a "Structured Learning Paths" section with cards.
 *   All cards in LearningPaths.tsx are currently `status: 'coming-soon'`.
 * - The direct roadmap detail pages /roadmaps/frontend and /roadmaps/backend
 *   are the two `isAvailable: true` routes with a real SkillTreeVisualizer.
 * - Tests use `waitUntil: 'domcontentloaded'` to avoid blocking on Firebase
 *   connections which may not complete with placeholder credentials.
 */

const GOTO_OPTS = { waitUntil: 'domcontentloaded' } as const;

test.describe('Roadmap navigation', () => {
  test('learning paths page loads and shows heading', async ({ page }) => {
    await page.goto('/paths', GOTO_OPTS);
    await expect(page).toHaveTitle(/DevPath/i);

    // The section heading from LearningPaths component
    await expect(
      page.getByRole('heading', { name: /structured learning paths/i })
    ).toBeVisible({ timeout: 15000 });
  });

  test('learning paths page shows the h1 heading', async ({ page }) => {
    await page.goto('/paths', GOTO_OPTS);
    await expect(
      page.getByRole('heading', { name: /learning paths/i })
    ).toBeVisible({ timeout: 15000 });
  });

  test('frontend roadmap detail page loads correctly', async ({ page }) => {
    await page.goto('/roadmaps/frontend', GOTO_OPTS);

    // Page title should contain roadmap name
    await expect(page).toHaveTitle(/Frontend Developer Roadmap/i);

    // Main heading on the page — it's a server-rendered h1
    await expect(
      page.getByRole('heading', { name: /frontend developer roadmap/i })
    ).toBeVisible({ timeout: 15000 });
  });

  test('frontend roadmap URL is correct after navigation', async ({ page }) => {
    await page.goto('/roadmaps/frontend', GOTO_OPTS);
    expect(page.url()).toContain('/roadmaps/frontend');
  });

  test('frontend roadmap detail page has a "Back to Paths" link', async ({
    page,
  }) => {
    await page.goto('/roadmaps/frontend', GOTO_OPTS);

    const backLink = page.getByRole('link', { name: /back to paths/i });
    await expect(backLink).toBeVisible({ timeout: 15000 });
    await expect(backLink).toHaveAttribute('href', '/paths');
  });

  test('"Back to Paths" link navigates back to /paths', async ({ page }) => {
    await page.goto('/roadmaps/frontend', GOTO_OPTS);

    await page.getByRole('link', { name: /back to paths/i }).click();
    await page.waitForURL('**/paths', { timeout: 15000 });

    expect(page.url()).toContain('/paths');
    await expect(
      page.getByRole('heading', { name: /learning paths/i })
    ).toBeVisible({ timeout: 15000 });
  });

  test('backend roadmap detail page loads correctly', async ({ page }) => {
    await page.goto('/roadmaps/backend', GOTO_OPTS);

    await expect(page).toHaveTitle(/Backend Developer Roadmap/i);
    // The h1 is server-rendered, give it extra time for heavy SkillTreeVisualizer
    await expect(
      page.getByRole('heading', { name: /backend developer roadmap/i })
    ).toBeVisible({ timeout: 20000 });
  });

  test('backend roadmap detail page URL is correct', async ({ page }) => {
    await page.goto('/roadmaps/backend', GOTO_OPTS);
    expect(page.url()).toContain('/roadmaps/backend');
  });

  test('devops roadmap shows coming soon page (not available)', async ({
    page,
  }) => {
    await page.goto('/roadmaps/devops', GOTO_OPTS);

    // ComingSoonRoadmap renders the title "DevOps Mastery Roadmap"
    // Check for any text containing DevOps with a generous timeout
    await expect(page.getByText(/DevOps/i).first()).toBeVisible({
      timeout: 20000,
    });
  });

  test('unknown roadmap ID shows not found state', async ({ page }) => {
    // dynamicParams = false means this generates a 404 in Next.js
    const response = await page.goto('/roadmaps/this-does-not-exist', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(404);
  });
});
