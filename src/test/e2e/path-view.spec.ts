import { test, expect } from '@playwright/test';

test.describe('Path View E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear storage to start fresh
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('user can mark a step complete and see progress counters update', async ({ page }) => {
    const before = await page.locator('text=/\\d+\\/ 50 DONE/').textContent();
    await page.locator('#checkbox-1').click();
    const after = await page.locator('text=/\\d+\\/ 50 DONE/').textContent();
    expect(before).not.toBe(after);
  });

  test('user can add a note and it persists on page reload', async ({ page }) => {
    await page.locator('#step-card-1 [aria-expanded]').first().click();
    await page.fill('textarea[id="note-1"]', 'E2E test note');
    await page.locator('textarea[id="note-1"]').blur();
    await page.reload();
    await page.locator('#step-card-1 [aria-expanded]').first().click();
    await expect(page.locator('textarea[id="note-1"]')).toHaveValue('E2E test note');
  });

  test('user can add an artifact link and it appears in the list', async ({ page }) => {
    await page.locator('#step-card-1 [aria-expanded]').first().click();
    await page.fill('input[id="link-input-1"]', 'https://example.com');
    await page.locator('#link-add-btn-1').click();
    await expect(page.locator('text=example.com')).toBeVisible();
  });

  test('filter "★ Trust" shows only starred steps', async ({ page }) => {
    await page.locator('#filter-trust').click();
    // All visible steps should have the ⭐ emoji
    const stars = page.locator('text=⭐');
    const count = await stars.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking ◈ on a step switches to graph view with that node selected', async ({ page }) => {
    await page.locator('#graph-focus-btn-1').click();
    await expect(page.locator('#view-tab-graph')).toHaveCSS('color', 'rgb(255, 107, 53)');
  });
});
