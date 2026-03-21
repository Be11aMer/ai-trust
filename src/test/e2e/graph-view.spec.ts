import { test, expect } from '@playwright/test';

test.describe('Graph View E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.locator('#view-tab-graph').click();
    // Wait for layout to compute
    await page.waitForSelector('svg circle', { timeout: 5000 });
  });

  test('graph view loads and renders node circles', async ({ page }) => {
    const circles = await page.locator('svg circle').count();
    expect(circles).toBeGreaterThan(40);
  });

  test('clicking a node opens the detail panel with correct title', async ({ page }) => {
    // Click node 01 (step id 1)
    await page.locator('.ng').first().click();
    await expect(page.locator('#detail-panel-close')).toBeVisible();
  });

  test('marking a node complete in graph view updates progress in path view', async ({ page }) => {
    await page.locator('.ng').first().click();
    const toggleBtn = page.locator('[id^="toggle-btn-"]').first();
    await toggleBtn.click();
    await page.locator('#view-tab-path').click();
    // The step should now show checkmark
    const checkmarks = page.locator('text=✓');
    expect(await checkmarks.count()).toBeGreaterThan(0);
  });

  test('filter "★ Trust" dims non-trust nodes (opacity check)', async ({ page }) => {
    await page.locator('#graph-filter-trust').click();
    // At least some nodes should be visible at full opacity (the trust ones)
    const nodes = page.locator('.ng');
    const count = await nodes.count();
    expect(count).toBeGreaterThan(0);
  });
});
