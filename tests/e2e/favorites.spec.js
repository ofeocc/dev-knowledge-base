import { test, expect } from '@playwright/test';

const PAGE_URL = '/dev-knowledge-base.html';

test.beforeEach(async ({ page }) => {
  // Always start from a clean favorites state so badge counts are predictable.
  await page.addInitScript(() => localStorage.removeItem('kb-favs'));
  await page.goto(PAGE_URL);
  await page.waitForSelector('.card-action.fav');
});

test.describe('Favorites', () => {
  test('clicking the favorite button marks a card as favorited', async ({ page }) => {
    const favBtn = page.locator('.card-action.fav').first();
    await favBtn.click();
    await expect(favBtn).toHaveClass(/active/);
  });

  test('the favorites badge count updates when favoriting cards', async ({ page }) => {
    const badge = page.locator('#fav-badge');

    // Initially empty -> badge is hidden.
    await expect(badge).toBeHidden();

    await page.locator('.card-action.fav').first().click();
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('1');

    // Favorite a second, distinct card.
    await page.locator('.card-action.fav').nth(1).click();
    await expect(badge).toHaveText('2');
  });

  test('favorites persist in localStorage', async ({ page }) => {
    const favBtn = page.locator('.card-action.fav').first();
    const favId = await favBtn.getAttribute('data-id');
    expect(favId).toBeTruthy();

    await favBtn.click();

    const stored = await page.evaluate(() => localStorage.getItem('kb-favs'));
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored);
    expect(parsed[favId]).toBe(true);
  });
});
