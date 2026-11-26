
import { test, expect, type Page } from '@playwright/test';
import { stat } from 'node:fs/promises';

import { SignupPage } from '../../src/pages/SignupPage';
import { AccountInformationPage } from '../../src/pages/AccountInformationPage';
import { ProductsPage } from '../../src/pages/ProductsPage';

import {
  createPurchaseUser,
  purchasePayment,
} from '../../src/fixtures/purchase-data';

// Convert displayed price such as "Rs. 500" into a number.
function parsePrice(priceText: string): number {
  const match = priceText.match(/[\d,]+(?:\.\d{1,2})?/);

  if (!match) {
    throw new Error(`Unable to parse product price: ${priceText}`);
  }

  const price = Number(match[0].replace(/,/g, ''));

  if (!Number.isFinite(price)) {
    throw new Error(`Invalid product price: ${priceText}`);
  }

  return price;
}

// Detect temporary website queue overload.
async function checkQueueFull(page: Page) {
  const queueFullHeading = page.getByRole('heading', {
    name: /this website is under heavy load.*queue full/i,
  });

  if (await queueFullHeading.isVisible().catch(() => false)) {
    throw new Error(
      'EXTERNAL_DEPENDENCY_FAILURE: Automation Exercise website is overloaded (queue full).'
    );
  }
}

// Verify order confirmation and identify an external queue-full failure.
async function verifyOrderConfirmation(page: Page) {
  const orderPlaced = page.getByText('ORDER PLACED!', {
    exact: false,
  });

  try {
    await expect(orderPlaced).toBeVisible({ timeout: 15000 });
  } catch (error) {
    const queueFullHeading = page.getByRole('heading', {
      name: /this website is under heavy load.*queue full/i,
    });

    const isQueueFull = await queueFullHeading
      .isVisible()
      .catch(() => false);

    if (isQueueFull) {
      throw new Error(
        'EXTERNAL_DEPENDENCY_FAILURE: Automation Exercise returned its queue-full page after payment submission.'
      );
    }

    throw error;
  }
}

test(
  'Complete purchase journey with a unique test account',
  async ({ page }, testInfo) => {
    const signupPage = new SignupPage(page);
    const accountInformationPage = new AccountInformationPage(page);
    const productsPage = new ProductsPage(page);

    // Generate a fresh account for every test attempt.
    const purchaseUser = createPurchaseUser();

    let accountCreated = false;
    let testFailed = false;

    try {
      // Step 1: Register a unique test account.
      await signupPage.open();
      await checkQueueFull(page);

      await signupPage.verifySignupForm();

      await signupPage.startSignup(
        purchaseUser.name,
        purchaseUser.email
      );

      await checkQueueFull(page);

      await expect(
        accountInformationPage.createAccountButton
      ).toBeVisible({ timeout: 15000 });

      await accountInformationPage.fillAccountInformation(
        purchaseUser.account
      );

      await accountInformationPage.createAccount();

      await expect(
        signupPage.accountCreatedHeading
      ).toBeVisible();

      accountCreated = true;

      // Step 2: Continue to the account.
      await page.getByRole('link', { name: 'Continue' }).click();

      const loggedInText = page.getByText(
        `Logged in as ${purchaseUser.name}`
      );

      const queueFullHeading = page.getByRole('heading', {
        name: /this website is under heavy load.*queue full/i,
      });

      await expect(
        loggedInText.or(queueFullHeading)
      ).toBeVisible({ timeout: 15000 });

      if (await queueFullHeading.isVisible().catch(() => false)) {
        throw new Error(
          'EXTERNAL_DEPENDENCY_FAILURE: Website queue is full after account creation. Account cleanup may need manual attention.'
        );
      }

      await expect(loggedInText).toBeVisible();

      // Step 3: Search and add Blue Top.
      await productsPage.open();
      await checkQueueFull(page);

      await productsPage.searchProduct('Blue Top');
      await checkQueueFull(page);

      await expect(
        productsPage.searchedProductsHeading
      ).toBeVisible();

      await productsPage.openProductDetails('Blue Top');

      await page.locator('#quantity').fill('4');
      await page.locator('button.cart').click();

      await expect(
        page.getByText('Added!', { exact: false })
      ).toBeVisible();

      // Step 4: Search and add Men Tshirt.
      await productsPage.open();
      await checkQueueFull(page);

      await productsPage.searchProduct('Men Tshirt');
      await checkQueueFull(page);

      await expect(
        productsPage.searchedProductsHeading
      ).toBeVisible();

      await productsPage.openProductDetails('Men Tshirt');

      await page.locator('button.cart').click();

      await expect(
        page.getByText('Added!', { exact: false })
      ).toBeVisible();

      // Step 5: Open cart.
      await page.getByRole('link', { name: 'View Cart' }).click();

      await expect(page).toHaveURL(/view_cart/);

      // Step 6: Verify both products and quantities.
      const blueTopRow = page.locator('#cart_info tbody tr').filter({
        hasText: 'Blue Top',
      });

      const menTshirtRow = page.locator('#cart_info tbody tr').filter({
        hasText: 'Men Tshirt',
      });

      await expect(blueTopRow).toBeVisible();
      await expect(menTshirtRow).toBeVisible();

      await expect(
        blueTopRow.locator('.cart_quantity button')
      ).toHaveText('4');

      await expect(
        menTshirtRow.locator('.cart_quantity button')
      ).toHaveText('1');

      // Step 7: Verify product prices and line totals.
      const blueTopUnitPrice = parsePrice(
        await blueTopRow.locator('.cart_price p').innerText()
      );

      const blueTopLineTotal = parsePrice(
        await blueTopRow.locator('.cart_total p').innerText()
      );

      const menTshirtUnitPrice = parsePrice(
        await menTshirtRow.locator('.cart_price p').innerText()
      );

      const menTshirtLineTotal = parsePrice(
        await menTshirtRow.locator('.cart_total p').innerText()
      );

      const blueTopExpectedTotal = blueTopUnitPrice * 4;
      const menTshirtExpectedTotal = menTshirtUnitPrice * 1;

      expect(
        blueTopLineTotal,
        'Blue Top line total should equal unit price multiplied by quantity'
      ).toBe(blueTopExpectedTotal);

      expect(
        menTshirtLineTotal,
        'Men Tshirt line total should equal unit price multiplied by quantity'
      ).toBe(menTshirtExpectedTotal);

      // Verify combined arithmetic for both cart items.
      const expectedCartTotal =
        blueTopExpectedTotal + menTshirtExpectedTotal;

      const calculatedCartTotal =
        blueTopLineTotal + menTshirtLineTotal;

      expect(
        calculatedCartTotal,
        'Combined cart total should equal the sum of both line totals'
      ).toBe(expectedCartTotal);

      // Step 8: Proceed to checkout.
      await page.getByText('Proceed To Checkout').click();

      // Step 9: Verify delivery address against source fixture.
      const deliveryAddress = page.locator('#address_delivery');

      await expect(deliveryAddress).toContainText(
        purchaseUser.account.firstName
      );

      await expect(deliveryAddress).toContainText(
        purchaseUser.account.lastName
      );

      await expect(deliveryAddress).toContainText(
        purchaseUser.account.address
      );

      await expect(deliveryAddress).toContainText(
        purchaseUser.account.city
      );

      await expect(deliveryAddress).toContainText(
        purchaseUser.account.state
      );

      await expect(deliveryAddress).toContainText(
        purchaseUser.account.zipcode
      );

      await expect(deliveryAddress).toContainText(
        purchaseUser.account.mobile
      );

      // Step 10: Verify billing address against source fixture.
      const billingAddress = page.locator('#address_invoice');

      await expect(billingAddress).toContainText(
        purchaseUser.account.firstName
      );

      await expect(billingAddress).toContainText(
        purchaseUser.account.lastName
      );

      await expect(billingAddress).toContainText(
        purchaseUser.account.address
      );

      await expect(billingAddress).toContainText(
        purchaseUser.account.city
      );

      await expect(billingAddress).toContainText(
        purchaseUser.account.state
      );

      await expect(billingAddress).toContainText(
        purchaseUser.account.zipcode
      );

      await expect(billingAddress).toContainText(
        purchaseUser.account.mobile
      );

      // Step 11: Enter order comment.
      const orderComment = page.locator('textarea[name="message"]');

      await expect(orderComment).toBeVisible();

      await orderComment.fill(
        'Automated Playwright purchase journey test.'
      );

      await expect(orderComment).toHaveValue(
        'Automated Playwright purchase journey test.'
      );

      // Step 12: Place the order.
      await page.getByRole('link', { name: 'Place Order' }).click();

      await checkQueueFull(page);

      // Verify payment form.
      await expect(
        page.locator('[data-qa="name-on-card"]')
      ).toBeVisible({ timeout: 10000 });

      // Step 13: Fill dummy payment details.
      await page.locator('[data-qa="name-on-card"]').fill(
        purchasePayment.nameOnCard
      );

      await page.locator('[data-qa="card-number"]').fill(
        purchasePayment.cardNumber
      );

      await page.locator('[data-qa="cvc"]').fill(
        purchasePayment.cvc
      );

      await page.locator('[data-qa="expiry-month"]').fill(
        purchasePayment.expiryMonth
      );

      await page.locator('[data-qa="expiry-year"]').fill(
        purchasePayment.expiryYear
      );

      // Step 14: Confirm order.
      await page.getByRole('button', {
        name: 'Pay and Confirm Order',
      }).click();

      await verifyOrderConfirmation(page);

      // Step 15: Download invoice.
      const downloadPromise = page.waitForEvent('download');

      await page.getByRole('link', {
        name: 'Download Invoice',
      }).click();

      const download = await downloadPromise;

      expect(
        download.suggestedFilename()
      ).toMatch(/invoice/i);

      const invoicePath = testInfo.outputPath(
        download.suggestedFilename()
      );

      await download.saveAs(invoicePath);

      // Verify downloaded invoice exists and is not empty.
      const invoiceStats = await stat(invoicePath);

      expect(
        invoiceStats.isFile(),
        'Invoice download should be a file'
      ).toBe(true);

      expect(
        invoiceStats.size,
        'Invoice file should not be empty'
      ).toBeGreaterThan(0);

    } catch (error) {
      testFailed = true;
      throw error;

    } finally {
      // Step 16: Attempt to delete disposable account.
      if (accountCreated && !page.isClosed()) {
        try {
          await checkQueueFull(page);

          await signupPage.deleteAccount();

          await expect(
            page.getByRole('heading', {
              name: 'ACCOUNT DELETED!',
            })
          ).toBeVisible({ timeout: 15000 });

        } catch (cleanupError) {
          console.error(
            'Account cleanup failed. Manual cleanup may be required:',
            cleanupError
          );

          if (!page.isClosed()) {
            await page.screenshot({
              path: testInfo.outputPath('cleanup-failure.png'),
              fullPage: true,
            }).catch(() => {});
          }

          if (!testFailed) {
            throw cleanupError;
          }
        }
      }
    }
  }
);

// UI 13 - Guest user is prompted to register before checkout.
test(
  'UI 13 - Guest user is prompted to register before checkout',
  async ({ page }) => {
    const productsPage = new ProductsPage(page);

    // Step 1: Open products page as guest.
    await productsPage.open();
    await checkQueueFull(page);

    // Step 2: Search for Blue Top.
    await productsPage.searchProduct('Blue Top');
    await checkQueueFull(page);

    await expect(
      productsPage.searchedProductsHeading
    ).toBeVisible();

    // Step 3: Open product details.
    await productsPage.openProductDetails('Blue Top');

    // Step 4: Add product to cart.
    await page.locator('#quantity').fill('1');
    await page.locator('button.cart').click();

    await expect(
      page.getByText('Added!', { exact: false })
    ).toBeVisible();

    // Step 5: Open cart.
    await page.getByRole('link', { name: 'View Cart' }).click();

    await expect(page).toHaveURL(/view_cart/);

    // Step 6: Proceed to checkout as guest.
    await page.getByText('Proceed To Checkout').click();

    // Step 7: Verify guest is prompted to register or login.
    await expect(
      page.getByText(
        'Register / Login account to proceed on checkout.'
      )
    ).toBeVisible();

    // Step 8: Verify registration/login link.
    await expect(
      page.getByRole('link', {
        name: /Register\s*\/\s*Login/i,
      })
    ).toBeVisible();
  }
);
