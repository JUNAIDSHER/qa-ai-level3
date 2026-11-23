
import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';

test('User can open Automation Exercise homepage', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.open();

  await expect(page).toHaveTitle(/Automation Exercise/);

  await homePage.verifyHomepage();
});
