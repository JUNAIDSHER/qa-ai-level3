import { APIRequestContext } from '@playwright/test';

export class AccountApi {
  constructor(private request: APIRequestContext) {}

  async createAccount(details: {
    name: string;
    email: string;
    password: string;
    title: string;
    birth_date: string;
    birth_month: string;
    birth_year: string;
    firstname: string;
    lastname: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    zipcode: string;
    state: string;
    city: string;
    mobile_number: string;
  }) {
    return await this.request.post('/api/createAccount', {
      form: details
    });
  }
  async deleteAccount(email: string, password: string) {
  return await this.request.delete('/api/deleteAccount', {
    form: {
      email,
      password
    }
  });
}
}