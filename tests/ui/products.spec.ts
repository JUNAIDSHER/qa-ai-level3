
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { ProductsPage } from '../../src/pages/ProductsPage';

test('User can search for a product', async ({ page }) => {
  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);

  await homePage.open();

  await productsPage.open();

  await expect(page).toHaveURL(/products/);

  await productsPage.searchProduct('Blue Top');

  await expect(productsPage.searchedProductsHeading).toBeVisible();

  await expect(page.getByText('Blue Top', { exact: true }).first()).toBeVisible();
});
