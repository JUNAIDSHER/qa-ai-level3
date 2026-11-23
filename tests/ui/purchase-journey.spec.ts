
import { test, expect } from '@playwright/test';
import { SignupPage } from '../../src/pages/SignupPage';
import { AccountInformationPage } from '../../src/pages/AccountInformationPage';
import { ProductsPage } from '../../src/pages/ProductsPage';
import {
  purchaseUser,
  purchasePayment
} from '../../src/fixtures/purchase-data';

test('Complete purchase journey with a unique test account', async ({ page }, testInfo) => {
  const signupPage = new SignupPage(page);
  const accountInformationPage = new AccountInformationPage(page);
  const productsPage = new ProductsPage(page);

  let accountCreated = false;

  try {
    // Step 1: Register a unique test account
    await signupPage.open();
    await signupPage.verifySignupForm();

    await signupPage.startSignup(
      purchaseUser.name,
      purchaseUser.email
    );

    await expect(
      accountInformationPage.createAccountButton
    ).toBeVisible();

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

    await expect(
      page.getByText(`Logged in as ${purchaseUser.name}`)
    ).toBeVisible();

    // Step 3: Search and add Blue Top
    await productsPage.open();
    await productsPage.searchProduct('Blue Top');

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
    await productsPage.searchProduct('Men Tshirt');

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

    // Step 11: Fill randomized dummy payment details
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
      name: 'Pay and Confirm Order'
    }).click();

    await expect(
      page.getByText('ORDER PLACED!', { exact: false })
    ).toBeVisible();

    // Step 13: Download invoice
    const downloadPromise = page.waitForEvent('download');

    await page.getByRole('link', {
      name: 'Download Invoice'
    }).click();

    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/invoice/i);

    const invoicePath = testInfo.outputPath(
      download.suggestedFilename()
    );

    await download.saveAs(invoicePath);

    console.log('Invoice saved:', invoicePath);

  } finally {
    // Step 14: Delete disposable account
    if (accountCreated && !page.isClosed()) {
      await signupPage.deleteAccount();

      await expect(
        page.getByRole('heading', { name: 'ACCOUNT DELETED!' })
      ).toBeVisible();
    }
  }
});


test('UI 13 - Guest user is prompted to register before checkout', async ({ page }) => {
  const productsPage = new ProductsPage(page);

  // Step 1: Open products page as guest
  await productsPage.open();

  // Step 2: Search for Blue Top
  await productsPage.searchProduct('Blue Top');

  await expect(productsPage.searchedProductsHeading).toBeVisible();

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

  // Step 8: Verify registration/login link exists
  await expect(
    page.getByRole('link', { name: /Register \/ Login/i })
  ).toBeVisible();
});

