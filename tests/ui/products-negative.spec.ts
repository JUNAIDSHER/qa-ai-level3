
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../src/pages/ProductsPage';

test('Searching for a non-existing product shows no results', async ({ page }) => {
  const productsPage = new ProductsPage(page);

  await productsPage.open();

  await productsPage.searchProduct('XYZ123NONEXISTENT');

  await expect(productsPage.searchedProductsHeading).toBeVisible();

  const results = await productsPage.getSearchResults();

  await expect(results).toHaveCount(0);
});
