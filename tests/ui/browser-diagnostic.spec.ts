
import { test, expect } from '@playwright/test';

test('Diagnostic: Chromium can open Automation Exercise website', async ({ page }) => {
  console.log('Opening Automation Exercise website...');

  const response = await page.goto('https://automationexercise.com/', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  // Log HTTP response details
  console.log('========== HTTP RESPONSE ==========');
  console.log('Status:', response?.status());
  console.log('URL:', response?.url());
  console.log('Headers:', JSON.stringify(await response?.allHeaders(), null, 2));

  // Capture response body for debugging, especially on 403
  if (response) {
    try {
      const body = await response.text();
      console.log('Response body:', body.substring(0, 4000));
    } catch (error) {
      console.log('Could not read response body:', error);
    }
  }

  // Log final page details
  console.log('========== PAGE DETAILS ==========');
  console.log('Final URL:', page.url());
  console.log('Page title:', await page.title());

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
