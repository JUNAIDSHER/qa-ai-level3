
import { test, expect } from '@playwright/test';
import { SignupPage } from '../../src/pages/SignupPage';
import { AccountInformationPage } from '../../src/pages/AccountInformationPage';
import { LoginPage } from '../../src/pages/LoginPage';

test('AE-04: User cannot register with an already registered email', async ({ page }) => {
  const signupPage = new SignupPage(page);
  const accountPage = new AccountInformationPage(page);
  const loginPage = new LoginPage(page);

  const name = 'QA Duplicate User';
  const email = `qa.duplicate.${Date.now()}@example.com`;
  const password = 'TestPass@123';

  // Step 1: Open signup page
  await signupPage.open();

  // Step 2: Register first account
  await signupPage.startSignup(name, email);

  // Step 3: Verify account information page
  await expect(
    signupPage.accountInformationHeading
  ).toBeVisible({ timeout: 20000 });

  // Step 4: Fill account information
  await accountPage.fillAccountInformation({
    password,
    firstName: 'QA',
    lastName: 'Tester',
    address: '123 Test Street',
    country: 'India',
    state: 'Test State',
    city: 'Test City',
    zipcode: '123456',
    mobile: '03001234567'
  });

  // Step 5: Create first account
  await accountPage.createAccount();

  await expect(
    signupPage.accountCreatedHeading
  ).toBeVisible({ timeout: 20000 });

  // Step 6: Continue to website
  await page.getByRole('link', { name: 'Continue' }).click();

  const loggedInText = page.getByText(`Logged in as ${name}`);

  const queueFullHeading = page.getByRole('heading', {
    name: /this website is under heavy load/i
  });

  await expect(
    loggedInText.or(queueFullHeading)
  ).toBeVisible({ timeout: 20000 });

  if (await queueFullHeading.isVisible().catch(() => false)) {
    throw new Error(
      'Website overloaded after account creation.'
    );
  }

  // Step 7: Logout
  await page.getByRole('link', { name: 'Logout' }).click();

  await expect(loginPage.loginHeading).toBeVisible({
    timeout: 20000
  });

  // Step 8: Attempt signup using the same email
  await signupPage.startSignup(name, email);

  // Duplicate email should show an error, not account information
  const duplicateEmailError = page.getByText(
    'Email Address already exist!',
    { exact: true }
  );

  await expect(duplicateEmailError).toBeVisible({
    timeout: 15000
  });

  // Step 9: Login using the original account
  await loginPage.open();

  await loginPage.login(email, password);

  await expect(loggedInText).toBeVisible({
    timeout: 20000
  });

  // Step 10: Delete disposable account
  await signupPage.deleteAccount();

  await expect(
    page.getByRole('heading', {
      name: 'ACCOUNT DELETED!'
    })
  ).toBeVisible({ timeout: 20000 });
});
