
import { test, expect } from '@playwright/test';
import { CategoryPage } from '../../src/pages/CategoryPage';

test('UI 9 - User can navigate to Women Tops category', async ({ page }) => {
  const categoryPage = new CategoryPage(page);

  // Step 1: Open homepage
  await categoryPage.open();

  // Step 2: Open Women category
  await categoryPage.openWomenCategory();

  // Step 3: Select Tops subcategory
  await categoryPage.openWomenTops();

  // Step 4: Verify category page
  await expect(page).toHaveURL(/category_products/);

  await expect(categoryPage.categoryHeading).toContainText('Women');

  await expect(categoryPage.productCards.first()).toBeVisible();
});


test('UI 10 - User can navigate to Men Tshirts category', async ({ page }) => {
  const categoryPage = new CategoryPage(page);

  // Step 1: Open homepage
  await categoryPage.open();

  // Step 2: Open Men category
  await categoryPage.openMenCategory();

  // Step 3: Select Tshirts subcategory
  await categoryPage.openMenTshirts();

  // Step 4: Verify category page
  await expect(page).toHaveURL(/category_products/);

  await expect(categoryPage.categoryHeading).toContainText('Men');

  await expect(categoryPage.productCards.first()).toBeVisible();
});
