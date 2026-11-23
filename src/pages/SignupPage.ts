
import { Page, Locator } from '@playwright/test';

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
    this.accountCreatedHeading = this.page.getByRole('heading', {
  name: 'ACCOUNT CREATED!'
});
this.deleteAccountButton = this.page.getByRole('link', {
  name: 'Delete Account'
});
  }

  async open() {
  await this.page.goto('/login', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  const queueMessage = this.page.getByRole('heading', {
    name: 'This website is under heavy load (queue full)'
  });

  if (await queueMessage.isVisible().catch(() => false)) {
    throw new Error(
      'Automation Exercise website is overloaded. Please rerun the test later.'
    );
  }

  await this.signupNameInput.waitFor({
    state: 'visible',
    timeout: 15000
  });
}

  async verifySignupForm() {
    await this.signupHeading.waitFor({ state: 'visible' });
    await this.signupNameInput.waitFor({ state: 'visible' });
    await this.signupEmailInput.waitFor({ state: 'visible' });
    await this.signupButton.waitFor({ state: 'visible' });
  }

  async startSignup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }
  async deleteAccount() {
  await this.deleteAccountButton.waitFor({
    state: 'visible',
    timeout: 15000
  });

  await this.deleteAccountButton.click();
}
}
