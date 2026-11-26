
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../src/pages/ProductsPage';

test('FI-02: Controlled HTTP 503 network failure during product search', async ({ page }) => {
  // Keep intentional fault injection out of normal test-suite runs.
  test.skip(
    process.env.RUN_FAULT_INJECTION !== 'true',
    'Run explicitly with RUN_FAULT_INJECTION=true'
  );

  const productsPage = new ProductsPage(page);
  let networkFaultInjected = false;
  let injectedStatus = 0;

  await productsPage.open();

  await page.route(/\/products\?search=/, async (route) => {
    networkFaultInjected = true;
    injectedStatus = 503;

    await route.fulfill({
      status: injectedStatus,
      contentType: 'text/html',
      body: `
        <!DOCTYPE html>
        <html>
          <head><title>503 Service Unavailable</title></head>
          <body>
            <h1>503 Service Unavailable</h1>
            <p>FI-02 controlled network fault injection.</p>
          </body>
        </html>
      `,
    });
  });

  await productsPage.searchProduct('Blue Top');

  expect(networkFaultInjected).toBe(true);
  expect(injectedStatus).toBe(503);

  // Intentionally fails because the injected 503 prevents normal search results.
  await expect(productsPage.searchedProductsHeading).toBeVisible({
    timeout: 10000,
  });
});
