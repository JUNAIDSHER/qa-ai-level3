
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../src/pages/ProductsPage';

test('FI-02: Controlled HTTP 503 network failure during product search', async ({ page }) => {
  test.skip(
    process.env.RUN_FAULT_INJECTION !== 'true',
    'Run explicitly with RUN_FAULT_INJECTION=true'
  );

  const productsPage = new ProductsPage(page);

  let networkFaultInjected = false;
  let injectedStatus = 0;

  // Open products page before injecting the fault.
  await productsPage.open();

  // Intercept the product search request and return HTTP 503.
  await page.route('**/products?search=*', async (route) => {
    networkFaultInjected = true;
    injectedStatus = 503;

    await route.fulfill({
      status: 503,
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

  // Trigger product search.
  const responsePromise = page.waitForResponse(
    response =>
      response.url().includes('/products?search=') &&
      response.status() === 503
  );

  await productsPage.searchProduct('Blue Top');

  const response = await responsePromise;

  // Verify that the controlled fault was actually injected.
  expect(networkFaultInjected).toBe(true);
  expect(injectedStatus).toBe(503);
  expect(response.status()).toBe(503);

  // Verify the injected failure response.
  await expect(
    page.getByRole('heading', {
      name: '503 Service Unavailable',
    })
  ).toBeVisible();

  // Record structured fault evidence.
  const faultEvidence = {
    faultId: 'FI-02',
    classification: 'NETWORK_FAULT',
    expectedStatus: 503,
    actualStatus: response.status(),
    injected: networkFaultInjected,
    url: response.url(),
  };

  console.log(
    'FI-02_RCA_EVIDENCE:',
    JSON.stringify(faultEvidence, null, 2)
  );
});
