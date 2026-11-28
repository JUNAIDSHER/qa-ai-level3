
import { test, expect } from '@playwright/test';

test('UI 18 - Footer subscription form is visible', async ({ page }) => {
  // Step 1: Open homepage and wait for initial HTML
  const response = await page.goto('/', {
    waitUntil: 'domcontentloaded',
  });

  // Step 2: Verify navigation response
  expect(response?.status()).toBe(200);

  // Step 3: Detect known external website challenges
  const pageTitle = await page.title();
  const bodyText = await page.locator('body').innerText().catch(() => '');

      if (
    /one moment, please|please wait while your request is being verified|cf-chl|checking your browser|queue full|under heavy load/i.test(
      `${pageTitle}\n${bodyText}`
    )
  ) {
    throw new Error(
      'EXTERNAL_DEPENDENCY_FAILURE: Website returned an anti-bot challenge or overload page.'
    );
  }

  // Step 4: Verify footer
  const footer = page.locator('footer');
  await expect(footer).toBeVisible();

  // Step 5: Scroll to footer
  await footer.scrollIntoViewIfNeeded();

  // Step 6: Verify subscription heading
  await expect(
    page.getByRole('heading', { name: 'Subscription' })
  ).toBeVisible();

  // Step 7: Verify email input
  await expect(
    page.locator('#susbscribe_email')
  ).toBeVisible();

  // Step 8: Verify subscribe button
  await expect(
    page.locator('#subscribe')
  ).toBeVisible();
});
