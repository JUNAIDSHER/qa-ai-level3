
import { Page, Locator } from '@playwright/test';

export class CategoryPage {
  readonly page: Page;
  readonly womenCategory: Locator;
  readonly menCategory: Locator;
  readonly womenTops: Locator;
  readonly menTshirts: Locator;
  readonly categoryHeading: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;

    this.womenCategory = page.getByRole('link', {
      name: 'Women'
    });

    this.menCategory = page.locator('a[href="#Men"]');

    this.womenTops = page.getByRole('link', {
      name: 'Tops'
    });

    this.menTshirts = page.getByRole('link', {
      name: 'Tshirts'
    });

    this.categoryHeading = page.locator('.title');
    this.productCards = page.locator('.product-image-wrapper');
  }

  async open() {
  await this.page.goto('/', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
}

  async openWomenCategory() {
    await this.womenCategory.click();
  }

  async openMenCategory() {
    await this.menCategory.click();
  }

  async openWomenTops() {
    await this.womenTops.click();
  }

  async openMenTshirts() {
    await this.menTshirts.click();
  }
}
