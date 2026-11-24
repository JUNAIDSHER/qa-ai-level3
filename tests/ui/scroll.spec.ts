
import { test, expect } from '@playwright/test';

test('UI 19 - User can scroll homepage to bottom and back to top', async ({ page }) => {

  // Step 1: Open homepage
  await page.goto('/', {
    waitUntil: 'domcontentloaded'
  });

  // Step 2: Verify homepage is visible
  await expect(
    page.getByRole('link', { name: 'Home' })
  ).toBeVisible();

  // Step 3: Verify page is scrollable
  const pageHeight = await page.evaluate(() => {
    return document.documentElement.scrollHeight;
  });

  const viewportHeight = await page.evaluate(() => {
    return window.innerHeight;
  });

  expect(pageHeight).toBeGreaterThan(viewportHeight);

  // Step 4: Scroll to footer
  const footer = page.locator('footer');

  await expect(footer).toBeAttached();
  await footer.scrollIntoViewIfNeeded();

  // Step 5: Verify footer is visible
  await expect(footer).toBeInViewport();

  // Step 6: Scroll back to top
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  // Step 7: Verify page returned to top
  await expect.poll(async () => {
    return page.evaluate(() => window.scrollY);
  }).toBe(0);

  // Step 8: Verify homepage navigation is visible
  await expect(
    page.getByRole('link', { name: 'Home' })
  ).toBeVisible();
});
