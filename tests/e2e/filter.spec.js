import { test, expect } from '@playwright/test';

const PAGE_URL = '/dev-knowledge-base.html';

// Counts currently visible cards within a given category (the app toggles
// `display: none` on cards to hide them).
const visibleCountForCat = (page, cat) =>
  page.evaluate((c) => {
    return Array.from(document.querySelectorAll(`.item-card[data-cat="${c}"]`)).filter(
      (el) => el.style.display !== 'none'
    ).length;
  }, cat);

test.beforeEach(async ({ page }) => {
  await page.goto(PAGE_URL);
  await page.waitForSelector('.item-card');
  // The app applies the default module (frontend) shortly after load.
  await page.waitForSelector('.module-tab.active');
});

test.describe('Module navigation', () => {
  test('the default module is frontend: frontend visible, backend hidden', async ({ page }) => {
    expect(await page.locator('.item-card[data-cat="frontend"]').count()).toBeGreaterThan(0);
    expect(await page.locator('.item-card[data-cat="backend"]').count()).toBeGreaterThan(0);

    await expect(page.locator('.module-tab[data-module="frontend"]')).toHaveClass(/active/);
    await expect(page.locator('.item-card[data-cat="frontend"]').first()).toBeVisible();
    await expect(page.locator('.item-card[data-cat="backend"]').first()).toBeHidden();
  });

  test('clicking the backend tab shows only the backend module', async ({ page }) => {
    await page.locator('.module-tab[data-module="backend"]').click();

    await expect(page.locator('.module-tab[data-module="backend"]')).toHaveClass(/active/);
    await expect(page.locator('.item-card[data-cat="backend"]').first()).toBeVisible();
    await expect(page.locator('.item-card[data-cat="frontend"]').first()).toBeHidden();
  });

  test('switching back to the frontend tab restores frontend cards', async ({ page }) => {
    await page.locator('.module-tab[data-module="backend"]').click();
    await expect(page.locator('.item-card[data-cat="backend"]').first()).toBeVisible();

    await page.locator('.module-tab[data-module="frontend"]').click();
    await expect(page.locator('.module-tab[data-module="frontend"]')).toHaveClass(/active/);
    await expect(page.locator('.item-card[data-cat="frontend"]').first()).toBeVisible();
    await expect(page.locator('.item-card[data-cat="backend"]').first()).toBeHidden();
  });

  test('combining a module with a search query narrows the results', async ({ page }) => {
    await page.locator('.module-tab[data-module="backend"]').click();
    const backendOnly = await visibleCountForCat(page, 'backend');
    expect(backendOnly).toBeGreaterThan(0);

    await page.locator('#search').fill('express');

    // The search further narrows the already-module-scoped backend list.
    await expect
      .poll(() => visibleCountForCat(page, 'backend'), { timeout: 5000 })
      .toBeLessThan(backendOnly);
    await expect
      .poll(() => visibleCountForCat(page, 'backend'), { timeout: 5000 })
      .toBeGreaterThan(0);
  });

  test('the dashboard module reveals the charts and hides cards', async ({ page }) => {
    await page.locator('.module-tab[data-module="dashboard"]').click();

    await expect(page.locator('.module-tab[data-module="dashboard"]')).toHaveClass(/active/);
    await expect(page.locator('#dashboard')).toBeVisible();
    await expect(page.locator('.item-card[data-cat="frontend"]').first()).toBeHidden();
  });
});
