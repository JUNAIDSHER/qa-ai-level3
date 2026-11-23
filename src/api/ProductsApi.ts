
import { APIRequestContext } from '@playwright/test';

export class ProductsApi {
  constructor(private request: APIRequestContext) {}

  async getAllProducts() {
    return await this.request.get('/api/productsList');
  }
  async searchProduct(productName: string) {
  return await this.request.post('/api/searchProduct', {
    form: {
      search_product: productName
    }
  });
}

async searchProductWithoutParameter() {
  return await this.request.post('/api/searchProduct');
}
}
