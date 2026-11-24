import { test, expect, Page } from '@playwright/test';
import { SignupPage } from '../../src/pages/SignupPage';
import { AccountInformationPage } from '../../src/pages/AccountInformationPage';
import { ProductsPage } from '../../src/pages/ProductsPage';
import {
  createPurchaseUser,
  purchasePayment,
} from '../../src/fixtures/purchase-data';

// Detect temporary website queue overload
async function checkQueueFull(page: Page) {
  const queueFullHeading = page.getByRole('heading', {
    name: /this website is under heavy load/i,
  });

  if (await queueFullHeading.isVisible().catch(() => false)) {
    throw new Error(
      'Website is currently overloaded (queue full). Please retry later.'
    );
  }
}

test('Complete purchase journey with a unique test account', async ({ page }, testInfo) => {
  const signupPage = new SignupPage(page);
  const accountInformationPage = new AccountInformationPage(page);
  const productsPage = new ProductsPage(page);

  // Generate a fresh account for every test attempt
  const purchaseUser = createPurchaseUser();

  let accountCreated = false;
  let testFailed = false;

  try {
    // Step 1: Register a unique test account
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

    // Step 2: Continue to the account
    await page.getByRole('link', { name: 'Continue' }).click();

    const loggedInText = page.getByText(
      `Logged in as ${purchaseUser.name}`
    );

    const queueFullHeading = page.getByRole('heading', {
      name: /this website is under heavy load/i,
    });

    // Wait for either successful login or queue-full response
    await expect(
      loggedInText.or(queueFullHeading)
    ).toBeVisible({ timeout: 15000 });

    if (await queueFullHeading.isVisible().catch(() => false)) {
      throw new Error(
        'Website queue is full after account creation. Account cleanup may need manual attention.'
      );
    }

    await expect(loggedInText).toBeVisible();

    // Step 3: Search and add Blue Top
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

    // Step 4: Search and add Men Tshirt
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

    // Step 5: Open cart
    await page.getByRole('link', { name: 'View Cart' }).click();

    await expect(page).toHaveURL(/view_cart/);

    // Step 6: Verify cart products and quantities
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

    // Step 7: Proceed to checkout
    await page.getByText('Proceed To Checkout').click();

    // Step 8: Verify delivery address
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

    // Step 9: Verify billing address
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

    // Step 10: Place the order
    await page.getByRole('link', { name: 'Place Order' }).click();

    console.log('URL after Place Order:', page.url());

    const paymentFields = [
      '[data-qa="name-on-card"]',
      '[data-qa="card-number"]',
      '[data-qa="cvc"]',
      '[data-qa="expiry-month"]',
      '[data-qa="expiry-year"]',
    ];

    for (const selector of paymentFields) {
      const visible = await page.locator(selector)
        .isVisible()
        .catch(() => false);

      console.log(`Payment field ${selector} visible: ${visible}`);
    }

    // Verify payment form
    await expect(
      page.locator('[data-qa="name-on-card"]')
    ).toBeVisible({ timeout: 10000 });

    // Step 11: Fill dummy payment details
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

    // Step 12: Confirm order
    await page.getByRole('button', {
      name: 'Pay and Confirm Order',
    }).click();

    await expect(
      page.getByText('ORDER PLACED!', { exact: false })
    ).toBeVisible();

    // Step 13: Download invoice
    const downloadPromise = page.waitForEvent('download');

    await page.getByRole('link', {
      name: 'Download Invoice',
    }).click();

    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/invoice/i);

    const invoicePath = testInfo.outputPath(
      download.suggestedFilename()
    );

    await download.saveAs(invoicePath);

    console.log('Invoice saved:', invoicePath);

  } catch (error) {
    testFailed = true;
    throw error;

  } finally {
    // Step 14: Attempt to delete disposable account
    if (accountCreated && !page.isClosed()) {
      try {
        // Do not attempt deletion on a queue-full page
        await checkQueueFull(page);

        await signupPage.deleteAccount();

        await expect(
          page.getByRole('heading', { name: 'ACCOUNT DELETED!' })
        ).toBeVisible({ timeout: 15000 });

        console.log('Disposable test account deleted successfully.');

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

});

test('UI 13 - Guest user is prompted to register before checkout', async ({ page }) => {
  const productsPage = new ProductsPage(page);

  // Step 1: Open products page as guest
  await productsPage.open();
  await checkQueueFull(page);

  // Step 2: Search for Blue Top
  await productsPage.searchProduct('Blue Top');
  await checkQueueFull(page);

  await expect(
    productsPage.searchedProductsHeading
  ).toBeVisible();

  // Step 3: Open product details
  await productsPage.openProductDetails('Blue Top');

  // Step 4: Add product to cart
  await page.locator('#quantity').fill('1');
  await page.locator('button.cart').click();

  await expect(
    page.getByText('Added!', { exact: false })
  ).toBeVisible();

  // Step 5: Open cart
  await page.getByRole('link', { name: 'View Cart' }).click();

  await expect(page).toHaveURL(/view_cart/);

  // Step 6: Proceed to checkout as guest
  await page.getByText('Proceed To Checkout').click();

  // Step 7: Verify guest is prompted to register or login
  await expect(
    page.getByText('Register / Login account to proceed on checkout.')
  ).toBeVisible();

  // Step 8: Verify registration/login link
  await expect(
    page.getByRole('link', { name: /Register\s*\/\s*Login/i })
  ).toBeVisible();
});

