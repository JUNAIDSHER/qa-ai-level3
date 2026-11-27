
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';

test('AE-03: User cannot login with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Test data: invalid credentials
  const email = 'invalid.user.12345@example.com';
  const password = 'WrongPassword@123';

  // Step 1: Open login page
  await loginPage.open();

  // Step 2: Verify login form
  await expect(loginPage.loginHeading).toBeVisible();

  // Step 3: Submit invalid credentials
  await loginPage.submitLogin(email, password);

  // Step 4: Verify invalid credentials error
  const invalidCredentialsError = page.getByText(
    'Your email or password is incorrect!',
    { exact: true }
  );

  await expect(
    invalidCredentialsError
      .or(loginPage.queueFullHeading)
      .or(loginPage.cloudflareError)
  ).toBeVisible({ timeout: 15000 });

  await loginPage.checkExternalFailure();

  await expect(invalidCredentialsError).toBeVisible();

  // Step 5: Verify user is not logged in
  await expect(loginPage.logoutLink).toHaveCount(0);
  await expect(loginPage.loggedInUser).toHaveCount(0);
});
