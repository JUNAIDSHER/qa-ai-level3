
import { test, expect } from '@playwright/test';

test('Diagnostic: Chromium can open Automation Exercise website', async ({ page }) => {
  console.log('DIAGNOSTIC: Starting website navigation');

  try {
    const response = await page.goto('https://automationexercise.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    console.log('DIAGNOSTIC_HTTP_STATUS:', response?.status() ?? 'NO_RESPONSE');
    console.log('DIAGNOSTIC_FINAL_URL:', page.url());
    console.log('DIAGNOSTIC_TITLE:', await page.title());

    const bodyText = await page.locator('body').innerText().catch(
      error => `BODY_READ_ERROR: ${String(error)}`
    );

    console.log('DIAGNOSTIC_BODY:', bodyText.slice(0, 2000));

    console.log(
      'DIAGNOSTIC_HOME_VISIBLE:',
      await page.getByRole('link', { name: 'Home' }).isVisible().catch(() => false)
    );

    console.log(
      'DIAGNOSTIC_PRODUCTS_VISIBLE:',
      await page.getByRole('link', { name: 'Products' }).isVisible().catch(() => false)
    );

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Automation Exercise/i);
  } catch (error) {
    console.log('DIAGNOSTIC_ERROR:', String(error));
    throw error;
  }
});
