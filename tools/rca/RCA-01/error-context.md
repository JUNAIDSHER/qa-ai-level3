# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\products.spec.ts >> User can search for a product
- Location: tests\ui\products.spec.ts:6:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Wrong Product Name', { exact: true }).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Wrong Product Name', { exact: true }).first() with timeout 5000ms
  - waiting for getByText('Wrong Product Name', { exact: true }).first()

```

```yaml
- banner:
  - link "Website for automation practice":
    - /url: /
    - img "Website for automation practice"
  - list:
    - listitem:
      - link " Home":
        - /url: /
    - listitem:
      - link " Products":
        - /url: /products
    - listitem:
      - link " Cart":
        - /url: /view_cart
    - listitem:
      - link " Signup / Login":
        - /url: /login
    - listitem:
      - link " Test Cases":
        - /url: /test_cases
    - listitem:
      - link " API Testing":
        - /url: /api_list
    - listitem:
      - link " Video Tutorials":
        - /url: https://www.youtube.com/c/AutomationExercise
    - listitem:
      - link " Contact us":
        - /url: /contact_us
- img "Website for practice"
- textbox "Search Product": Blue Top
- button ""
- heading "Category" [level=2]
- heading " Women" [level=4]:
  - link " Women":
    - /url: "#Women"
- heading " Men" [level=4]:
  - link " Men":
    - /url: "#Men"
- heading " Kids" [level=4]:
  - link " Kids":
    - /url: "#Kids"
- insertion:
  - iframe
- heading "Brands" [level=2]
- list:
  - listitem:
    - link "(6) Polo":
      - /url: /brand_products/Polo
  - listitem:
    - link "(5) H&M":
      - /url: /brand_products/H&M
  - listitem:
    - link "(5) Madame":
      - /url: /brand_products/Madame
  - listitem:
    - link "(3) Mast & Harbour":
      - /url: /brand_products/Mast & Harbour
  - listitem:
    - link "(4) Babyhug":
      - /url: /brand_products/Babyhug
  - listitem:
    - link "(3) Allen Solly Junior":
      - /url: /brand_products/Allen Solly Junior
  - listitem:
    - link "(3) Kookie Kids":
      - /url: /brand_products/Kookie Kids
  - listitem:
    - link "(5) Biba":
      - /url: /brand_products/Biba
- heading "Searched Products" [level=2]
- img "ecommerce website products"
- heading "Rs. 500" [level=2]
- paragraph: Blue Top
- text:  Add to cart
- heading "Rs. 500" [level=2]
- paragraph: Blue Top
- text:  Add to cart
- list:
  - listitem:
    - link " View Product":
      - /url: /product_details/1
- insertion:
  - heading "These are topics related to the article that might interest you" [level=2]: Discover more
  - link "Women's Dresses"
  - link "Men's Jeans"
  - link "Kids Clothing"
- contentinfo:
  - heading "Subscription" [level=2]
  - textbox "Your email address"
  - button ""
  - paragraph: Get the most recent updates from our site and be updated your self...
  - paragraph: Copyright © 2021 All rights reserved
  - insertion:
    - iframe
```

# Test source

```ts
  1  | 
  2  | import { test, expect } from '@playwright/test';
  3  | import { HomePage } from '../../src/pages/HomePage';
  4  | import { ProductsPage } from '../../src/pages/ProductsPage';
  5  | 
  6  | test('User can search for a product', async ({ page }) => {
  7  |   const homePage = new HomePage(page);
  8  |   const productsPage = new ProductsPage(page);
  9  | 
  10 |   await homePage.open();
  11 | 
  12 |   await productsPage.open();
  13 | 
  14 |   await expect(page).toHaveURL(/products/);
  15 | 
  16 |   await productsPage.searchProduct('Blue Top');
  17 | 
  18 |   await expect(productsPage.searchedProductsHeading).toBeVisible();
  19 | 
> 20 |   await expect(page.getByText('Wrong Product Name', { exact: true }).first()).toBeVisible();
     |                                                                               ^ Error: expect(locator).toBeVisible() failed
  21 | });
  22 | 
```