
import { Page, Locator, expect } from '@playwright/test';

export class SignupPage {
  readonly page: Page;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly accountCreatedHeading: Locator;
  readonly deleteAccountButton: Locator;
  readonly signupHeading: Locator;
  readonly accountInformationHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signupNameInput = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');

    this.signupHeading = page.locator('h2').filter({
      hasText: 'New User Signup!'
    });

    this.accountInformationHeading = page.locator('h2').filter({
      hasText: 'ENTER ACCOUNT INFORMATION'
    });

    this.accountCreatedHeading = page.getByRole('heading', {
      name: 'ACCOUNT CREATED!'
    });

    this.deleteAccountButton = page.getByRole('link', {
      name: 'Delete Account'
    });
  }

  async open() {
    await this.page.goto('/login', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    const queueFullHeading = this.page.getByRole('heading', {
      name: /this website is under heavy load/i
    });

    await expect(
      this.signupNameInput.or(queueFullHeading)
    ).toBeVisible({ timeout: 20000 });

    if (await queueFullHeading.isVisible().catch(() => false)) {
      throw new Error(
        'Website is overloaded (queue full). Please retry later.'
      );
    }

    await this.verifySignupForm();
  }

  async verifySignupForm() {
    await expect(this.signupHeading).toBeVisible();
    await expect(this.signupNameInput).toBeVisible();
    await expect(this.signupEmailInput).toBeVisible();
    await expect(this.signupButton).toBeVisible();
  }

  async startSignup(name: string, email: string) {
    await this.verifySignupForm();

    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);

    await this.signupButton.click();

    // Do not assert the next page here.
    // A new email opens account information.
    // An existing email displays a duplicate-email error.
  }

  async deleteAccount() {
    await expect(this.deleteAccountButton).toBeVisible({
      timeout: 15000
    });

    await this.deleteAccountButton.click();
  }
}
