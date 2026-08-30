import { test, expect } from '@playwright/test';

const PAGE_URL = '/dev-knowledge-base.html';

test.beforeEach(async ({ page }) => {
  await page.goto(PAGE_URL);
  await page.waitForSelector('.item-card');
});

test.describe('Navigation', () => {
  test('back-to-top button appears on scroll and returns to top', async ({ page }) => {
    const backToTop = page.locator('#back-to-top');

    // At the top of the page the button is hidden (no .visible class).
    await expect(backToTop).not.toHaveClass(/visible/);

    // Scroll past the 400px threshold that reveals the button.
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(backToTop).toHaveClass(/visible/);

    // Clicking scrolls smoothly back to the top.
    await backToTop.click();
    await expect
      .poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 })
      .toBeLessThanOrEqual(5);
    await expect(backToTop).not.toHaveClass(/visible/);
  });

  test('quick nav dots appear on scroll and navigate to sections', async ({ page }) => {
    // The quick nav is hidden via CSS on mobile viewports (<=768px).
    const viewport = page.viewportSize();
    test.skip(viewport && viewport.width <= 768, 'quick-nav is hidden on mobile viewports');

    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(page.locator('#quick-nav')).toHaveClass(/visible/);

    const dots = page.locator('.quick-nav-dot');
    expect(await dots.count()).toBeGreaterThan(0);
    await expect(dots.first()).toBeVisible();

    const firstTargetId = await dots.first().getAttribute('data-target');
    expect(firstTargetId).toBeTruthy();

    // Clicking a dot smooth-scrolls to the matching section.  We use evaluate
    // to call .click() directly because the sticky navbar's filter-chips bar
    // can overlap the dot at certain scroll positions, intercepting pointer
    // events from a real Playwright click.
    await dots.first().evaluate((el) => el.click());

    // The targeted section should end up near the top of the viewport
    // (the app offsets by the navbar height, so allow a little slack).
    await expect
      .poll(
        async () => {
          return await page.evaluate((id) => {
            const el = document.getElementById(id);
            if (!el) return null;
            return el.getBoundingClientRect().top;
          }, firstTargetId);
        },
        { timeout: 10000 }
      )
      .toBeLessThanOrEqual(120);
  });

  test('page uses smooth scroll behavior', async ({ page }) => {
    const behavior = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior
    );
    expect(behavior).toBe('smooth');
  });
});
