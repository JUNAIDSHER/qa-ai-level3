
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
  readonly queueFullHeading: Locator;
  readonly cloudflareError: Locator;

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

    this.queueFullHeading = page.getByRole('heading', {
      name: /this website is under heavy load/i
    });

    // Match only the exact Cloudflare error text.
    // Avoid matching both the message and "Error code 520".
    this.cloudflareError = page.getByText(
      'Web server is returning an unknown error',
      { exact: true }
    );
  }

  async checkExternalFailure(): Promise<void> {
    if (await this.queueFullHeading.isVisible().catch(() => false)) {
      throw new Error(
        'EXTERNAL_DEPENDENCY_FAILURE: AutomationExercise queue is full.'
      );
    }

    if (await this.cloudflareError.isVisible().catch(() => false)) {
      throw new Error(
        'EXTERNAL_DEPENDENCY_FAILURE: Cloudflare returned HTTP 520.'
      );
    }
  }

  async open(): Promise<void> {
    await this.page.goto('/login', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    await expect(
      this.signupNameInput
        .or(this.queueFullHeading)
        .or(this.cloudflareError)
    ).toBeVisible({ timeout: 20000 });

    await this.checkExternalFailure();

    await this.verifySignupForm();
  }

  async verifySignupForm(): Promise<void> {
    await expect(this.signupHeading).toBeVisible();
    await expect(this.signupNameInput).toBeVisible();
    await expect(this.signupEmailInput).toBeVisible();
    await expect(this.signupButton).toBeVisible();
  }

  // Submit signup details without assuming a new account will be created.
  async submitSignup(name: string, email: string): Promise<void> {
    await this.checkExternalFailure();

    await this.verifySignupForm();

    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  // Normal signup must reach the account information page.
  async startSignup(name: string, email: string): Promise<void> {
    await this.submitSignup(name, email);

    await expect(
      this.accountInformationHeading
        .or(this.queueFullHeading)
        .or(this.cloudflareError)
    ).toBeVisible({ timeout: 15000 });

    await this.checkExternalFailure();

    await expect(this.accountInformationHeading).toBeVisible();
  }

  async deleteAccount(): Promise<void> {
    await this.checkExternalFailure();

    await expect(this.deleteAccountButton).toBeVisible({
      timeout: 15000
    });

    console.log('Deleting test account...');

    await this.deleteAccountButton.click();

    await expect(
      this.accountDeletedHeading()
        .or(this.queueFullHeading)
        .or(this.cloudflareError)
    ).toBeVisible({ timeout: 15000 });

    await this.checkExternalFailure();

    await expect(this.accountDeletedHeading()).toBeVisible();
  }

  private accountDeletedHeading(): Locator {
    return this.page.getByRole('heading', {
      name: 'ACCOUNT DELETED!'
    });
  }
}
