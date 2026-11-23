
import { test, expect } from '@playwright/test';

test('Diagnostic: Chromium can open Automation Exercise website', async ({ page }) => {
  const response = await page.goto('https://automationexercise.com/', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  // Verify successful HTTP response
  expect(response?.status()).toBe(200);

  // Verify website title
  await expect(page).toHaveTitle(/Automation Exercise/i);

  // Verify homepage navigation
  await expect(
    page.getByRole('link', { name: 'Home' })
  ).toBeVisible();

  // Verify Products navigation
  await expect(
    page.getByRole('link', { name: 'Products' })
  ).toBeVisible();
});
