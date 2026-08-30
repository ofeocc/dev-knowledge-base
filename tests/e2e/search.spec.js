import { test, expect } from '@playwright/test';

const PAGE_URL = '/dev-knowledge-base.html';

// Counts every filterable card type, returning only the ones currently shown
// (the app toggles `display: none` to hide cards).
const visibleCardCount = (page) =>
  page.evaluate(() => {
    const sel =
      '#content-root .item-card, #content-root .tech-card, #content-root .ai-model-card';
    return Array.from(document.querySelectorAll(sel)).filter(
      (c) => c.style.display !== 'none'
    ).length;
  });

test.beforeEach(async ({ page }) => {
  await page.goto(PAGE_URL);
  // Wait for the dynamically rendered cards before interacting.
  await page.waitForSelector('.item-card');
});

test.describe('Search functionality', () => {
  test('typing a query filters the card list', async ({ page }) => {
    const initial = await visibleCardCount(page);
    expect(initial).toBeGreaterThan(0);

    await page.locator('#search').fill('react');

    // The app debounces the input (~150ms) before re-filtering.
    await expect
      .poll(() => visibleCardCount(page), { timeout: 5000 })
      .toBeLessThan(initial);
    await expect
      .poll(() => visibleCardCount(page), { timeout: 5000 })
      .toBeGreaterThan(0);
  });

  test('clearing the search restores all cards', async ({ page }) => {
    const initial = await visibleCardCount(page);

    await page.locator('#search').fill('react');
    await expect
      .poll(() => visibleCardCount(page), { timeout: 5000 })
      .toBeLessThan(initial);

    await page.locator('#search').fill('');
    await expect
      .poll(() => visibleCardCount(page), { timeout: 5000 })
      .toBe(initial);
  });

  test('searching for "React" keeps the React card visible', async ({ page }) => {
    await page.locator('#search').fill('react');

    // Match the framework card whose name is exactly "React" (not React Router,
    // Preact, etc.).
    const reactCard = page
      .locator('.item-card')
      .filter({ has: page.locator('.card-name', { hasText: /^React$/ }) });

    await expect(reactCard).toBeVisible();
  });

  test('the "/" keyboard shortcut focuses the search box', async ({ page }) => {
    // Ensure focus is not already on the search input.
    await page.locator('body').click();
    await page.keyboard.press('/');

    await expect(page.locator('#search')).toBeFocused();
    // The handler calls preventDefault, so no "/" character is typed.
    await expect(page.locator('#search')).toHaveValue('');
  });

  test('Escape clears the active search query', async ({ page }) => {
    await page.locator('#search').fill('react');
    await expect(page.locator('#search')).toHaveValue('react');

    await page.locator('#search').focus();
    await page.keyboard.press('Escape');

    await expect(page.locator('#search')).toHaveValue('');
  });

  test('the URL hash updates with the search query (q parameter)', async ({ page }) => {
    await page.locator('#search').fill('react');
    // The app syncs the URL hash (~300ms after the input debounce).
    await expect(page).toHaveURL(/#q=react/);
  });
});
