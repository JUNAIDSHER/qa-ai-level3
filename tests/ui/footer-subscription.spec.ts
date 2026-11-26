
import { test, expect } from '@playwright/test';

test('UI 18 - Footer subscription form is visible', async ({ page }) => {

  // Step 1: Open homepage and wait for page load
  await page.goto('/', {
    waitUntil: 'load'
  });

  // Step 2: Wait for footer to become visible
  const footer = page.locator('footer');
  await expect(footer).toBeVisible();

  // Step 3: Scroll to footer
  await footer.scrollIntoViewIfNeeded();

  // Step 4: Verify subscription heading
  await expect(
    page.getByRole('heading', { name: 'Subscription' })
  ).toBeVisible();

  // Step 5: Verify email input
  await expect(
    page.locator('#susbscribe_email')
  ).toBeVisible();

  // Step 6: Verify subscribe button
  await expect(
    page.locator('#subscribe')
  ).toBeVisible();
});
