
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
      .or(signupPage.queueFullHeading)
      .or(signupPage.cloudflareError)
  ).toBeVisible({ timeout: 20000 });

  await signupPage.checkExternalFailure();

  await expect(signupPage.accountCreatedHeading).toBeVisible();

  // Step 6: Continue and verify logged-in state
  await page.getByRole('link', { name: 'Continue' }).click();

  await expect(loginPage.loggedInUser).toContainText(name, {
    timeout: 20000
  });

  // Step 7: Logout
  await loginPage.logoutLink.click();

  await expect(loginPage.loginHeading).toBeVisible({
    timeout: 20000
  });

  // Step 8: Attempt signup using the same email
  await signupPage.submitSignup(name, email);

  const duplicateEmailError = page.getByText(
    'Email Address already exist!',
    { exact: true }
  );

  await expect(
    duplicateEmailError
      .or(signupPage.queueFullHeading)
      .or(signupPage.cloudflareError)
  ).toBeVisible({ timeout: 15000 });

  await signupPage.checkExternalFailure();

  // Verify duplicate email is rejected
  await expect(duplicateEmailError).toBeVisible();

  // Account information page must not open again
  await expect(
    signupPage.accountInformationHeading
  ).not.toBeVisible();

  // Step 9: Login using the original account
  await loginPage.open();

  await loginPage.login(email, password);

  await expect(loginPage.loggedInUser).toContainText(name, {
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
