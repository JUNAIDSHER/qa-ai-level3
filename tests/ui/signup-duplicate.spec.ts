
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

  // Step 2: Register the first account
  await signupPage.startSignup(name, email);

  // Step 3: Verify account information page
  await expect(signupPage.accountInformationHeading).toBeVisible();

  // Step 4: Fill account information
  await accountPage.fillAccountInformation();

  // Step 5: Create first account
  await accountPage.createAccount();

  // Step 6: Verify account creation
  await expect(signupPage.accountCreatedHeading).toBeVisible();

  // Step 7: Continue to website
  await page.getByRole('link', { name: 'Continue' }).click();

  // Step 8: Logout from first account
  await page.getByRole('link', { name: 'Logout' }).click();

  // Step 9: Attempt signup using the same email
  await signupPage.open();
  await signupPage.startSignup(name, email);

  // Step 10: Verify duplicate email error
  await expect(
    page.getByText('Email Address already exist!')
  ).toBeVisible();

  // Step 11: Login with the original account
  await loginPage.open();
  await loginPage.login(email, password);

  await expect(
    page.getByText(`Logged in as ${name}`)
  ).toBeVisible();

  // Step 12: Delete disposable account
  await signupPage.deleteAccount();

  // Step 13: Verify account deletion
  await expect(
    page.getByRole('heading', { name: 'ACCOUNT DELETED!' })
  ).toBeVisible();
});
