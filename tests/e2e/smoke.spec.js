import { test, expect } from '@playwright/test';

// The knowledge base is a single static page rendered into #content-root.
const PAGE_URL = '/dev-knowledge-base.html';

test.beforeEach(async ({ page }) => {
  await page.goto(PAGE_URL);
});

test.describe('Smoke tests', () => {
  test('page loads successfully with the expected title', async ({ page }) => {
    await expect(page).toHaveTitle(/开发者知识库/);
  });

  test('all main content sections render', async ({ page }) => {
    // Sections are injected dynamically by app.js, so wait for them.
    await page.waitForSelector('.content-section');
    const sectionCount = await page.locator('.content-section').count();
    expect(sectionCount).toBeGreaterThan(0);
  });

  test('statistics numbers are displayed', async ({ page }) => {
    // Wait for app.js to populate the stat elements (they start with static
    // placeholders in the HTML and are overwritten on DOMContentLoaded).
    await page.waitForSelector('.item-card');

    await expect(page.locator('#stat-total')).toBeVisible();
    await expect(page.locator('#stat-cats')).toBeVisible();
    await expect(page.locator('#stat-tech')).toBeVisible();

    const total = (await page.locator('#stat-total').textContent()) ?? '';
    const cats = (await page.locator('#stat-cats').textContent()) ?? '';
    const tech = (await page.locator('#stat-tech').textContent()) ?? '';

    expect(total.trim()).not.toEqual('');
    expect(cats.trim()).not.toEqual('');
    expect(tech.trim()).not.toEqual('');

    // stat-total may have a "+" suffix (e.g. "389+"); strip non-digits.
    expect(Number(total.trim().replace(/\D/g, ''))).toBeGreaterThan(0);
    expect(Number(cats.trim())).toBeGreaterThan(0);
    expect(Number(tech.trim())).toBeGreaterThan(0);
  });

  test('navigation bar is visible', async ({ page }) => {
    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('search box is visible and focusable', async ({ page }) => {
    const search = page.locator('#search');
    await expect(search).toBeVisible();
    await search.focus();
    await expect(search).toBeFocused();
  });
});
