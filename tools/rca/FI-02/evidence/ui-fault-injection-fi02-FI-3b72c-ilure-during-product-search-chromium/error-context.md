# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\fault-injection-fi02.spec.ts >> FI-02: Controlled HTTP 503 network failure during product search
- Location: tests\ui\fault-injection-fi02.spec.ts:5:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Searched Products' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Searched Products' }) with timeout 10000ms
  - waiting for getByRole('heading', { name: 'Searched Products' })

```

```yaml
- heading "503 Service Unavailable" [level=1]
- paragraph: FI-02 controlled network fault injection.
```

# Test source

```ts
  1  | 
  2  | import { test, expect } from '@playwright/test';
  3  | import { ProductsPage } from '../../src/pages/ProductsPage';
  4  | 
  5  | test('FI-02: Controlled HTTP 503 network failure during product search', async ({ page }) => {
  6  |   // Keep intentional fault injection out of normal test-suite runs.
  7  |   test.skip(
  8  |     process.env.RUN_FAULT_INJECTION !== 'true',
  9  |     'Run explicitly with RUN_FAULT_INJECTION=true'
  10 |   );
  11 | 
  12 |   const productsPage = new ProductsPage(page);
  13 |   let networkFaultInjected = false;
  14 |   let injectedStatus = 0;
  15 | 
  16 |   await productsPage.open();
  17 | 
  18 |   await page.route(/\/products\?search=/, async (route) => {
  19 |     networkFaultInjected = true;
  20 |     injectedStatus = 503;
  21 | 
  22 |     await route.fulfill({
  23 |       status: injectedStatus,
  24 |       contentType: 'text/html',
  25 |       body: `
  26 |         <!DOCTYPE html>
  27 |         <html>
  28 |           <head><title>503 Service Unavailable</title></head>
  29 |           <body>
  30 |             <h1>503 Service Unavailable</h1>
  31 |             <p>FI-02 controlled network fault injection.</p>
  32 |           </body>
  33 |         </html>
  34 |       `,
  35 |     });
  36 |   });
  37 | 
  38 |   await productsPage.searchProduct('Blue Top');
  39 | 
  40 |   expect(networkFaultInjected).toBe(true);
  41 |   expect(injectedStatus).toBe(503);
  42 | 
  43 |   // Intentionally fails because the injected 503 prevents normal search results.
> 44 |   await expect(productsPage.searchedProductsHeading).toBeVisible({
     |                                                      ^ Error: expect(locator).toBeVisible() failed
  45 |     timeout: 10000,
  46 |   });
  47 | });
  48 | 
```