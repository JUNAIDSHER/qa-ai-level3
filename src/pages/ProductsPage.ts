
import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly productsLink: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productsLink = page.getByRole('link', {
      name: 'Products',
    });

    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');

    this.searchedProductsHeading = page.getByRole('heading', {
      name: 'Searched Products',
    });
  }

  private get queueFullHeading() {
    return this.page.getByRole('heading', {
      name: /this website is under heavy load \(queue full\)/i,
    });
  }

  private get cloudflareErrorHeading() {
    return this.page.getByRole('heading', {
      name: /web server is returning an unknown error error code 520/i,
    });
  }

  private async checkExternalFailure() {
    if (await this.queueFullHeading.isVisible().catch(() => false)) {
      throw new Error(
        'EXTERNAL_DEPENDENCY_FAILURE: Automation Exercise website is overloaded (queue full).'
      );
    }

    if (await this.cloudflareErrorHeading.isVisible().catch(() => false)) {
      throw new Error(
        'EXTERNAL_DEPENDENCY_FAILURE: Cloudflare returned HTTP 520 (origin server error).'
      );
    }
  }

  async open() {
    await this.page.goto('/products', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await this.checkExternalFailure();

    await this.searchInput.waitFor({
      state: 'visible',
      timeout: 15000,
    });
  }

  async getSearchResults() {
    return this.page.locator('.productinfo');
  }

  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();

    await this.checkExternalFailure();
  }

 
async openProductDetails(productName: string) {
  const productCard = this.page
    .locator('.product-image-wrapper')
    .filter({ hasText: productName })
    .first();

  const viewProductLink = productCard.locator(
    'a[href*="/product_details/"]'
  );

  await viewProductLink.waitFor({
    state: 'visible',
    timeout: 15000,
  });

  await Promise.all([
    this.page.waitForURL(/\/product_details\/\d+/, {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    }),
    viewProductLink.click(),
  ]);

  const quantityInput = this.page.locator('#quantity');

  await expect(
    quantityInput
      .or(this.queueFullHeading)
      .or(this.cloudflareErrorHeading)
  ).toBeVisible({
    timeout: 15000,
  });

  await this.checkExternalFailure();
}

}
