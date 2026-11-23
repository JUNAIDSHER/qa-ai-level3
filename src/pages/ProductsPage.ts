
import { Page, Locator } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly productsLink: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeading = page.getByRole('heading', {
      name: 'Searched Products'
    });
  }

  async open() {
  await this.page.goto('/products', {
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

  await this.searchInput.waitFor({
    state: 'visible',
    timeout: 15000
  });
}

  async getSearchResults() {
    return this.page.locator('.productinfo');
  }

  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  
async openProductDetails(productName: string) {
  const productCard = this.page.locator('.product-image-wrapper').filter({
    hasText: productName
  }).first();

  const viewProductLink = productCard.locator(
    'a[href*="/product_details/"]'
  );

  await viewProductLink.click();
}

}
