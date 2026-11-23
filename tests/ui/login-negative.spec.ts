
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

  // Step 3: Enter invalid credentials
  await loginPage.login(email, password);

  // Step 4: Verify error message
  await expect(
    page.getByText('Your email or password is incorrect!')
  ).toBeVisible();

  // Step 5: Verify user is not logged in
  await expect(
    page.getByText('Logged in as')
  ).toHaveCount(0);
});
