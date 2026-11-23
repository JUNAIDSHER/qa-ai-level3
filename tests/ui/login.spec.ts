
import { test, expect } from '@playwright/test';
import { SignupPage } from '../../src/pages/SignupPage';
import { AccountInformationPage } from '../../src/pages/AccountInformationPage';
import { LoginPage } from '../../src/pages/LoginPage';

test('AE-02: User can login and logout successfully', async ({ page }) => {
  const signupPage = new SignupPage(page);
  const accountPage = new AccountInformationPage(page);
  const loginPage = new LoginPage(page);

  const name = 'QA Login User';
  const email = `qa.login.${Date.now()}@example.com`;
  const password = 'TestPass@123';

  // Step 1: Open signup page
  await signupPage.open();

  // Step 2: Register a new account
  await signupPage.startSignup(name, email);

  // Step 3: Verify account information page
  await expect(signupPage.accountInformationHeading).toBeVisible();

  // Step 4: Fill account information
  await accountPage.fillAccountInformation();

  // Step 5: Create account
  await accountPage.createAccount();

  // Step 6: Verify account creation
  await expect(signupPage.accountCreatedHeading).toBeVisible();

  // Step 7: Continue to website
  await page.getByRole('link', { name: 'Continue' }).click();

  // Step 8: Verify user is logged in
  await expect(
    page.getByText(`Logged in as ${name}`)
  ).toBeVisible();

  // Step 9: Logout
  await page.getByRole('link', { name: 'Logout' }).click();

  // Step 10: Verify login page
  await expect(loginPage.loginHeading).toBeVisible();

  // Step 11: Login with registered credentials
  await loginPage.login(email, password);

  // Step 12: Verify successful login
  await expect(
    page.getByText(`Logged in as ${name}`)
  ).toBeVisible();

  // Step 13: Delete disposable account
  await signupPage.deleteAccount();

  // Step 14: Verify account deletion
  await expect(
    page.getByRole('heading', { name: 'ACCOUNT DELETED!' })
  ).toBeVisible();
});




test('UI 14 - Logged out user cannot access account page', async ({ page }) => {
  const signupPage = new SignupPage(page);
  const accountPage = new AccountInformationPage(page);
  const loginPage = new LoginPage(page);

  const name = 'QA Logout User';
  const email = `qa.logout.${Date.now()}@example.com`;
  const password = 'TestPass@123';

  // Step 1: Open signup page
  await signupPage.open();

  // Step 2: Register a new account
  await signupPage.startSignup(name, email);

  // Step 3: Verify account information page
  await expect(signupPage.accountInformationHeading).toBeVisible();

  // Step 4: Fill account information
  await accountPage.fillAccountInformation();

  // Step 5: Create account
  await accountPage.createAccount();

  // Step 6: Verify account creation
  await expect(signupPage.accountCreatedHeading).toBeVisible();

  // Step 7: Continue to website
  await page.getByRole('link', { name: 'Continue' }).click();

  // Step 8: Verify logged-in user
  await expect(
    page.getByText(`Logged in as ${name}`)
  ).toBeVisible();

  // Step 9: Logout
  await page.getByRole('link', { name: 'Logout' }).click();

  // Step 10: Verify logout
  await expect(page).toHaveURL(/login/);

  await expect(loginPage.loginHeading).toBeVisible();

  // Step 11: Try accessing account page directly
  await page.goto('/account', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // Step 12: Verify website redirects user to homepage
  await expect(page).toHaveURL('https://automationexercise.com/');

  // Step 13: Verify user is logged out
  await expect(
    page.getByRole('link', { name: 'Signup / Login' })
  ).toBeVisible();

  await expect(
    page.getByText(`Logged in as ${name}`)
  ).toHaveCount(0);

  // Step 14: Open login page for account cleanup
  await loginPage.open();

  // Step 15: Verify login form is available
  await expect(loginPage.loginHeading).toBeVisible();

  // Step 16: Login again
  await loginPage.login(email, password);

  await expect(
    page.getByText(`Logged in as ${name}`)
  ).toBeVisible();

  // Step 17: Delete disposable account
  await signupPage.deleteAccount();

  // Step 18: Verify account deletion
  await expect(
    page.getByRole('heading', { name: 'ACCOUNT DELETED!' })
  ).toBeVisible();
});

test('UI 15 - User can navigate to login page from homepage', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Step 1: Open homepage
  await page.goto('/');

  // Step 2: Click Signup / Login
  await page.getByRole('link', { name: 'Signup / Login' }).click();

  // Step 3: Verify login page URL
  await expect(page).toHaveURL(/login/);

  // Step 4: Verify login form heading
  await expect(loginPage.loginHeading).toBeVisible();

  // Step 5: Verify email and password fields
  await expect(loginPage.emailInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
});

test('UI 16 - Login form validates empty fields', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Step 1: Open login page
  await loginPage.open();

  // Step 2: Verify login form
  await expect(loginPage.loginHeading).toBeVisible();

  // Step 3: Click login without entering credentials
  await loginPage.loginButton.click();

  // Step 4: Verify browser blocks empty email field
  await expect(loginPage.emailInput).toBeFocused();

  // Step 5: Verify email field is still empty
  await expect(loginPage.emailInput).toHaveValue('');

  // Step 6: Verify password field is still empty
  await expect(loginPage.passwordInput).toHaveValue('');
});

test('UI 17 - User can navigate to Cart page from homepage', async ({ page }) => {

  // Step 1: Open homepage
  await page.goto('/', {
    waitUntil: 'domcontentloaded'
  });

  // Step 2: Verify homepage
  await expect(
    page.getByRole('link', { name: 'Home' })
  ).toBeVisible();

  // Step 3: Click Cart link
  await page.getByRole('link', { name: 'Cart' }).click();

  // Step 4: Verify cart page URL
  await expect(page).toHaveURL(/view_cart/);

  // Step 5: Verify cart page is loaded
  await expect(
    page.getByText('Shopping Cart', { exact: false }).first()
  ).toBeVisible();
});