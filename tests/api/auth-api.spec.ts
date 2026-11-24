
import { test, expect } from '@playwright/test';
import { AuthApi } from '../../src/api/AuthApi';
import { SignupPage } from '../../src/pages/SignupPage';
import { AccountInformationPage } from '../../src/pages/AccountInformationPage';
import { createPurchaseUser } from '../../src/fixtures/purchase-data';

// API 4 - Valid login
test('API 4 - Verify login with valid credentials', async ({ page, request }) => {
  const signupPage = new SignupPage(page);
  const accountPage = new AccountInformationPage(page);
  const authApi = new AuthApi(request);

  // Generate a fresh user for this test execution
  const purchaseUser = createPurchaseUser();

  // Step 1: Open signup page
  await signupPage.open();

  // Step 2: Create a registered account
  await signupPage.startSignup(
    purchaseUser.name,
    purchaseUser.email
  );

  // Step 3: Check for website overload
  const queueMessage = page.getByRole('heading', {
    name: /this website is under heavy load/i,
  });

  if (await queueMessage.isVisible().catch(() => false)) {
    throw new Error(
      'Environment issue: website overloaded during account creation.'
    );
  }

  // Step 4: Fill account information and create account
  await accountPage.fillAccountInformation(purchaseUser.account);
  await accountPage.createAccount();

  // Step 5: Verify account creation
  await expect(signupPage.accountCreatedHeading).toBeVisible({
    timeout: 15000,
  });

  // Step 6: Verify login through API
  const response = await authApi.verifyLogin(
    purchaseUser.email,
    purchaseUser.account.password
  );

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.responseCode).toBe(200);
  expect(body.message).toContain('User exists');
});

// API 5 - Missing email
test('API 5 - Verify login without email', async ({ request }) => {
  const authApi = new AuthApi(request);

  const response = await authApi.verifyLoginWithoutEmail('TestPass@123');

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.responseCode).toBe(400);
  expect(body.message).toContain('email');
});

// API 6 - Invalid credentials
test('API 6 - Verify login with invalid credentials', async ({ request }) => {
  const authApi = new AuthApi(request);

  const response = await authApi.verifyLoginWithInvalidCredentials();

  // Debug API response
  const responseBody = await response.text();

  console.log('API 6 status:', response.status());
  console.log('API 6 response:', responseBody);

  // Verify expected HTTP status
  expect(response.status()).toBe(200);

  const body = JSON.parse(responseBody);

  expect(body.responseCode).toBe(404);
  expect(body.message).toContain('User not found');
});
