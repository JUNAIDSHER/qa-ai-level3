
import { test, expect } from '@playwright/test';
import { SignupPage } from '../../src/pages/SignupPage';
import { AccountInformationPage } from '../../src/pages/AccountInformationPage';

test('AE-01: User can create and delete an account', async ({ page }) => {
  const signupPage = new SignupPage(page);
  const accountInfoPage = new AccountInformationPage(page);

  const name = 'QA Test User';
  const email = `qa.test.${Date.now()}@example.com`;

  // Open signup page
  await signupPage.open();

  // Verify signup form
  await expect(signupPage.signupHeading).toBeVisible();

  // Register user
  await signupPage.startSignup(name, email);

  // Verify account information page
  await expect(signupPage.accountInformationHeading).toBeVisible();

  // Fill account information
  await accountInfoPage.fillAccountInformation();

  // Create account
  await accountInfoPage.createAccount();

  // Verify account creation
  await expect(signupPage.accountCreatedHeading).toBeVisible();

  // Continue to website
  await page.getByRole('link', { name: 'Continue' }).click();

  // Verify logged-in user
  await expect(
    page.getByText(`Logged in as ${name}`)
  ).toBeVisible();

  // Delete disposable account
  await signupPage.deleteAccount();

  // Verify account deletion
  await expect(
    page.getByRole('heading', { name: 'ACCOUNT DELETED!' })
  ).toBeVisible();
});
