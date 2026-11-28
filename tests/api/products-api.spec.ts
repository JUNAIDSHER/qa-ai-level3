
import { test, expect } from '@playwright/test';
import { ProductsApi } from '../../src/api/ProductsApi';
import { getApiJsonResponse } from './helpers/api-response';

// API 1 - Get all products
test('API 1 - Get all products list', async ({ request }) => {
  const productsApi = new ProductsApi(request);

  const response = await productsApi.getAllProducts();
  const body = await getApiJsonResponse(response, 'API 1');

  expect(response.status()).toBe(200);
  expect(body.responseCode).toBe(200);
  expect(body.products).toBeInstanceOf(Array);
  expect(body.products.length).toBeGreaterThan(0);
});

// API 2 - Search product
test('API 2 - Search product', async ({ request }) => {
  const productsApi = new ProductsApi(request);

  const response = await productsApi.searchProduct('top');
  const body = await getApiJsonResponse(response, 'API 2');

  expect(response.status()).toBe(200);
  expect(body.responseCode).toBe(200);
  expect(body.products).toBeInstanceOf(Array);
  expect(body.products.length).toBeGreaterThan(0);
});

// API 3 - Search without parameter
test('API 3 - Search product without parameter', async ({ request }) => {
  const productsApi = new ProductsApi(request);

  const response = await productsApi.searchProductWithoutParameter();
  const body = await getApiJsonResponse(response, 'API 3');

  expect(response.status()).toBe(200);
  expect(body.responseCode).toBe(400);
  expect(body.message).toContain('search_product');
});
