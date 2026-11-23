
import { APIRequestContext } from '@playwright/test';

export class AuthApi {
  constructor(private request: APIRequestContext) {}

  async verifyLogin(email: string, password: string) {
    return await this.request.post('/api/verifyLogin', {
      form: {
        email,
        password
      }
    });
  }
  async verifyLoginWithoutEmail(password: string) {
  return await this.request.post('/api/verifyLogin', {
    form: {
      password
    }
  });
}

async verifyLoginWithInvalidCredentials() {
  return await this.request.post('/api/verifyLogin', {
    form: {
      email: 'invalid.user@example.com',
      password: 'WrongPassword123'
    }
  });
}
}
