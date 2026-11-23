import { test, expect } from '@playwright/test';

test('UI 18 - Footer subscription form is visible', async ({ page }) => {

  // Step 1: Open homepage
  await page.goto('/', {
    waitUntil: 'domcontentloaded'
  });

  // Step 2: Scroll to footer
  await page.locator('footer').scrollIntoViewIfNeeded();

  // Step 3: Verify subscription heading
  await expect(
    page.getByRole('heading', { name: 'Subscription' })
  ).toBeVisible();

  // Step 4: Verify email input
  await expect(
    page.locator('#susbscribe_email')
  ).toBeVisible();

  // Step 5: Verify subscribe button
  await expect(
    page.locator('#subscribe')
  ).toBeVisible();
});