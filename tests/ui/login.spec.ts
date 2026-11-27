
import { test, expect, Page } from '@playwright/test';
import { SignupPage } from '../../src/pages/SignupPage';
import { AccountInformationPage } from '../../src/pages/AccountInformationPage';
import { LoginPage } from '../../src/pages/LoginPage';

// Detect external dependency failures
async function checkExternalFailure(page: Page) {
  const queueFullHeading = page.getByRole('heading', {
    name: /this website is under heavy load/i,
  });

  const cloudflareError = page.getByText(
    /web server is returning an unknown error|error code 520/i
  );

  if (await queueFullHeading.isVisible().catch(() => false)) {
    throw new Error(
      'EXTERNAL_DEPENDENCY_FAILURE: AutomationExercise queue is full.'
    );
  }

  if (await cloudflareError.isVisible().catch(() => false)) {
    throw new Error(
      'EXTERNAL_DEPENDENCY_FAILURE: Cloudflare returned HTTP 520.'
    );
  }
}

// Verify account creation
async function verifyAccountCreated(signupPage: SignupPage) {
  await expect(
    signupPage.accountCreatedHeading
      .or(signupPage.queueFullHeading)
      .or(signupPage.cloudflareError)
  ).toBeVisible({ timeout: 15000 });

  await signupPage.checkExternalFailure();

  await expect(signupPage.accountCreatedHeading).toBeVisible();
}

// Verify account deletion
async function verifyAccountDeleted(page: Page) {
  const deletedHeading = page.getByRole('heading', {
    name: 'ACCOUNT DELETED!',
  });

  const queueFullHeading = page.getByRole('heading', {
    name: /this website is under heavy load/i,
  });

  const cloudflareError = page.getByText(
    /web server is returning an unknown error|error code 520/i
  );

  await expect(
    deletedHeading
      .or(queueFullHeading)
      .or(cloudflareError)
  ).toBeVisible({ timeout: 15000 });

  await checkExternalFailure(page);

  await expect(deletedHeading).toBeVisible();
}

test('AE-02: User can login and logout successfully', async ({ page }) => {
  const signupPage = new SignupPage(page);
  const accountPage = new AccountInformationPage(page);
  const loginPage = new LoginPage(page);

  const name = 'QA Login User';
  const email = `qa.login.${Date.now()}@example.com`;
  const password = 'TestPass@123';

  // Open signup page
  await signupPage.open();

  // Register account
  await signupPage.startSignup(name, email);

  // Fill account information
  await accountPage.fillAccountInformation();
  await accountPage.createAccount();

  await verifyAccountCreated(signupPage);

  // Continue to homepage
  await page.getByRole('link', { name: 'Continue' }).click();

  await expect(loginPage.loggedInUser).toContainText(name);

  // Logout
  await loginPage.logoutLink.click();

  const queueFullHeading = page.getByRole('heading', {
    name: /this website is under heavy load/i,
  });

  const cloudflareError = page.getByRole('heading', {
    name: /web server is returning an unknown error|error code 520/i,
  });

  // Wait for expected logout page or known external failure
  await expect(
    loginPage.loginHeading
      .or(queueFullHeading)
      .or(cloudflareError)
  ).toBeVisible({ timeout: 15000 });

  await checkExternalFailure(page);

  // Verify logged-out state
  await expect(loginPage.loginHeading).toBeVisible();
  await expect(loginPage.loggedInUser).toHaveCount(0);

  // Login again
  await loginPage.login(email, password);

  await expect(loginPage.loggedInUser).toContainText(name);

  // Delete disposable account
  await signupPage.deleteAccount();

  await verifyAccountDeleted(page);
});

test('UI 14 - Logged out user cannot access account page', async ({ page }) => {
  const signupPage = new SignupPage(page);
  const accountPage = new AccountInformationPage(page);
  const loginPage = new LoginPage(page);

  const name = 'QA Logout User';
  const email = `qa.logout.${Date.now()}@example.com`;
  const password = 'TestPass@123';

  // Open signup page
  await signupPage.open();

  // Register account
  await signupPage.startSignup(name, email);

  // Fill account information
  await accountPage.fillAccountInformation();

  // Create account
  await accountPage.createAccount();

  await verifyAccountCreated(signupPage);

  // Continue to homepage
  await page.getByRole('link', { name: 'Continue' }).click();

  await expect(loginPage.loggedInUser).toContainText(name);

  // Logout
  await loginPage.logoutLink.click();

  // Verify logged-out state
  await expect(loginPage.loginHeading).toBeVisible();

  await expect(loginPage.loggedInUser).toHaveCount(0);

  // Access protected account page directly
  await page.goto('/account', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  await checkExternalFailure(page);

  // Verify unauthenticated access is denied
  await expect(page).toHaveURL('https://automationexercise.com/');

  await expect(
    page.getByRole('link', { name: 'Signup / Login' })
  ).toBeVisible();

  await expect(loginPage.loggedInUser).toHaveCount(0);

  // Login again for account cleanup
  await loginPage.open();
  await loginPage.login(email, password);

  await expect(loginPage.loggedInUser).toContainText(name);

  // Delete disposable account
  await signupPage.deleteAccount();

  await verifyAccountDeleted(page);
});

test('UI 15 - User can navigate to login page from homepage', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto('/');

  await page.getByRole('link', { name: 'Signup / Login' }).click();

  await expect(page).toHaveURL(/login/);
  await expect(loginPage.loginHeading).toBeVisible();
  await expect(loginPage.emailInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
});

test('UI 16 - Login form validates empty fields', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();

  await expect(loginPage.loginHeading).toBeVisible();

  await loginPage.loginButton.click();

  await expect(loginPage.emailInput).toBeFocused();
  await expect(loginPage.emailInput).toHaveValue('');
  await expect(loginPage.passwordInput).toHaveValue('');
});

test('UI 17 - User can navigate to Cart page from homepage', async ({ page }) => {
  await page.goto('/', {
    waitUntil: 'domcontentloaded',
  });

  await expect(
    page.getByRole('link', { name: 'Home' })
  ).toBeVisible();

  await page.getByRole('link', { name: 'Cart' }).click();

  await expect(page).toHaveURL(/view_cart/);

  const shoppingCartHeading = page.getByText(
    'Shopping Cart',
    { exact: false }
  ).first();

  const cloudflareError = page.getByRole('heading', {
    name: /web server is returning an unknown error error code 520/i,
  });

  const queueFullError = page.getByRole('heading', {
    name: /this website is under heavy load/i,
  });

  await expect(
    shoppingCartHeading
      .or(cloudflareError)
      .or(queueFullError)
  ).toBeVisible({ timeout: 15000 });

  if (await cloudflareError.isVisible().catch(() => false)) {
    throw new Error(
      'EXTERNAL_DEPENDENCY_FAILURE: Cloudflare returned HTTP 520 while opening Cart.'
    );
  }

  if (await queueFullError.isVisible().catch(() => false)) {
    throw new Error(
      'EXTERNAL_DEPENDENCY_FAILURE: Website returned queue-full response while opening Cart.'
    );
  }

  await expect(shoppingCartHeading).toBeVisible();
});
