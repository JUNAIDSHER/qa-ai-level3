
import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly productsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.productsLink = page.getByRole('link', { name: 'Products' });
  }

  async open() {
  await this.page.goto('/', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
}

  async verifyHomepage() {
    await this.homeLink.waitFor({ state: 'visible' });
    await this.productsLink.waitFor({ state: 'visible' });
  }
}
