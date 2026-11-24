
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.locator('[data-qa="login-email"]');
    this.passwordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');

    this.loginHeading = page.getByRole('heading', {
      name: 'Login to your account'
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

    // Wait for either the login heading or queue-full message.
    await expect(
      this.loginHeading.or(queueFullHeading)
    ).toBeVisible({ timeout: 20000 });

    if (await queueFullHeading.isVisible().catch(() => false)) {
      throw new Error('Website is overloaded (queue full). Retry later.');
    }

    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async login(email: string, password: string) {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
