
import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../src/pages/ProductsPage';

// UI 8 - Add two products to cart with correct quantities
test('User can add two products to cart with correct quantities', async ({ page }) => {
  const productsPage = new ProductsPage(page);

  // First product: Blue Top
  await productsPage.open();
  await productsPage.searchProduct('Blue Top');

  await expect(productsPage.searchedProductsHeading).toBeVisible();
  await productsPage.openProductDetails('Blue Top');

  await page.locator('#quantity').fill('4');
  await page.locator('button.cart').click();

  await expect(page.getByText('Added!', { exact: false })).toBeVisible();

  // Second product: Men Tshirt
  await productsPage.open();
  await productsPage.searchProduct('Men Tshirt');

  await expect(productsPage.searchedProductsHeading).toBeVisible();
  await productsPage.openProductDetails('Men Tshirt');

  await page.locator('button.cart').click();

  await expect(page.getByText('Added!', { exact: false })).toBeVisible();

  // Open cart
  await page.getByRole('link', { name: 'View Cart' }).click();

  await expect(page).toHaveURL(/view_cart/);

  const blueTopRow = page.locator('#cart_info tbody tr').filter({
    hasText: 'Blue Top'
  });

  const menTshirtRow = page.locator('#cart_info tbody tr').filter({
    hasText: 'Men Tshirt'
  });

  await expect(blueTopRow).toBeVisible();
  await expect(menTshirtRow).toBeVisible();

  await expect(
    blueTopRow.locator('.cart_quantity button')
  ).toHaveText('4');

  await expect(
    menTshirtRow.locator('.cart_quantity button')
  ).toHaveText('1');
});

// UI 11 - Verify product quantity in cart
test('UI 11 - User can verify product quantity in cart', async ({ page }) => {
  const productsPage = new ProductsPage(page);

  // Open products page
  await productsPage.open();

  // Search Blue Top
  await productsPage.searchProduct('Blue Top');

  await expect(productsPage.searchedProductsHeading).toBeVisible();

  // Open product details
  await productsPage.openProductDetails('Blue Top');

  // Add one item
  await page.locator('#quantity').fill('1');
  await page.locator('button.cart').click();

  await expect(page.getByText('Added!', { exact: false })).toBeVisible();

  // Open cart
  await page.getByRole('link', { name: 'View Cart' }).click();

  await expect(page).toHaveURL(/view_cart/);

  // Verify product and quantity
  const blueTopRow = page.locator('#cart_info tbody tr').filter({
    hasText: 'Blue Top'
  });

  await expect(blueTopRow).toBeVisible();

  await expect(
    blueTopRow.locator('.cart_quantity button')
  ).toHaveText('1');
});

test('UI 12 - User can remove a product from cart', async ({ page }) => {
  const productsPage = new ProductsPage(page);

  // Open products page
  await productsPage.open();

  // Search and open Blue Top
  await productsPage.searchProduct('Blue Top');
  await expect(productsPage.searchedProductsHeading).toBeVisible();
  await productsPage.openProductDetails('Blue Top');

  // Add product to cart
  await page.locator('button.cart').click();
  await expect(page.getByText('Added!', { exact: false })).toBeVisible();

  // Open cart
  await page.getByRole('link', { name: 'View Cart' }).click();
  await expect(page).toHaveURL(/view_cart/);

  // Verify product exists
  const blueTopRow = page.locator('#cart_info tbody tr').filter({
    hasText: 'Blue Top'
  });

  await expect(blueTopRow).toBeVisible();

  // Remove product
  await blueTopRow.locator('.cart_quantity_delete').click();

  // Verify cart is empty
  await expect(page.locator('#cart_info tbody tr')).toHaveCount(0);
});