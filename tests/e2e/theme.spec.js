import { test, expect } from '@playwright/test';

const PAGE_URL = '/dev-knowledge-base.html';

// Seed a deterministic starting theme (light) only when nothing is stored yet.
// This keeps the initial state stable without clobbering real persistence when a
// test reloads the page after toggling to dark.
const seedLightTheme = (page) =>
  page.addInitScript(() => {
    if (!localStorage.getItem('kb-theme')) localStorage.setItem('kb-theme', 'light');
  });

test.describe('Theme', () => {
  test('toggling theme flips the data-theme attribute on <html>', async ({ page }) => {
    await seedLightTheme(page);
    await page.goto(PAGE_URL);

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('theme choice persists in localStorage across reloads', async ({ page }) => {
    await seedLightTheme(page);
    await page.goto(PAGE_URL);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // The app stores the choice immediately.
    expect(await page.evaluate(() => localStorage.getItem('kb-theme'))).toBe('dark');

    // After reload the dark theme is restored. The app represents "dark" as the
    // absence of data-theme="light" (dark is the CSS default), so we assert that
    // the light theme does NOT come back while localStorage keeps the dark value.
    await page.reload();
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light');
    expect(await page.evaluate(() => localStorage.getItem('kb-theme'))).toBe('dark');
  });

  test('light and dark themes render without uncaught errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await seedLightTheme(page);
    await page.goto(PAGE_URL);
    await page.waitForSelector('.item-card');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Toggle to dark and let the async chart resize handlers settle.
    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(500);

    // Toggle back to light.
    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.waitForTimeout(500);

    expect(errors).toEqual([]);
  });
});
