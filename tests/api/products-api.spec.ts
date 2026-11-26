
import { test, expect } from '@playwright/test';
import { ProductsApi } from '../../src/api/ProductsApi';

// Helper: Log API response details for debugging
async function logApiResponse(response: any, apiName: string) {
  const responseBody = await response.text();
  const headers = response.headers();

  console.log(`\n========== ${apiName} RESPONSE ==========`);
  console.log('HTTP STATUS:', response.status());
  console.log('RESPONSE HEADERS:', JSON.stringify(headers, null, 2));
  console.log('RESPONSE BODY:', responseBody.slice(0, 2000));
  console.log('========================================\n');

  return responseBody;
}

// API 1 - Get all products
test('API 1 - Get all products list', async ({ request }) => {
  const productsApi = new ProductsApi(request);

  const response = await productsApi.getAllProducts();
  const responseBody = await logApiResponse(response, 'API 1');

  expect(response.status()).toBe(200);

  const body = JSON.parse(responseBody);

  expect(body.responseCode).toBe(200);
  expect(body.products).toBeInstanceOf(Array);
  expect(body.products.length).toBeGreaterThan(0);
});

// API 2 - Search product
test('API 2 - Search product', async ({ request }) => {
  const productsApi = new ProductsApi(request);

  const response = await productsApi.searchProduct('top');
  const responseBody = await logApiResponse(response, 'API 2');

  expect(response.status()).toBe(200);

  const body = JSON.parse(responseBody);

  expect(body.responseCode).toBe(200);
  expect(body.products).toBeInstanceOf(Array);
  expect(body.products.length).toBeGreaterThan(0);
});

// API 3 - Search without parameter
test('API 3 - Search product without parameter', async ({ request }) => {
  const productsApi = new ProductsApi(request);

  const response = await productsApi.searchProductWithoutParameter();
  const responseBody = await logApiResponse(response, 'API 3');

  expect(response.status()).toBe(200);

  const body = JSON.parse(responseBody);

  expect(body.responseCode).toBe(400);
  expect(body.message).toContain('search_product');
});
