
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginHeading: Locator;
  readonly queueFullHeading: Locator;
  readonly cloudflareError: Locator;
  readonly loggedInUser: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.locator('[data-qa="login-email"]');
    this.passwordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');

    this.loginHeading = page.getByRole('heading', {
      name: 'Login to your account'
    });

    this.queueFullHeading = page.getByRole('heading', {
      name: /this website is under heavy load/i
    });

    this.cloudflareError = page.getByText(
      /web server is returning an unknown error|error code 520/i
    );

    this.loggedInUser = page.getByRole('listitem').filter({
      hasText: /Logged in as/
    });

    this.logoutLink = page.getByRole('link', {
      name: /Logout/i
    });
  }

  async checkExternalFailure() {
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

  async open() {
    await this.page.goto('/login', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    await expect(
      this.loginHeading
        .or(this.queueFullHeading)
        .or(this.cloudflareError)
    ).toBeVisible({ timeout: 20000 });

    await this.checkExternalFailure();

    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  // Submit credentials without assuming login will succeed.
  async submitLogin(email: string, password: string) {
    await this.checkExternalFailure();

    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Successful login verification.
  async login(email: string, password: string) {
    await this.submitLogin(email, password);

    await expect(
      this.logoutLink
        .or(this.queueFullHeading)
        .or(this.cloudflareError)
    ).toBeVisible({ timeout: 15000 });

    await this.checkExternalFailure();

    await expect(this.logoutLink).toBeVisible();
    await expect(this.loggedInUser).toBeVisible();
    await expect(this.loggedInUser).toContainText(/Logged in as/);
  }
}
