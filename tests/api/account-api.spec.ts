
import { test, expect } from '@playwright/test';
import { AccountApi } from '../../src/api/AccountApi';
import { getApiJsonResponse } from './helpers/api-response';

function createAccountData() {
  const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

  return {
    name: `QA API User ${uniqueId}`,
    email: `qa.api.${uniqueId}@example.com`,
    password: 'TestPass@123',
    title: 'Mr',
    birth_date: '10',
    birth_month: '5',
    birth_year: '1995',
    firstname: 'QA',
    lastname: 'Tester',
    company: 'QA Company',
    address1: '123 Test Street',
    address2: 'Test Area',
    country: 'India',
    zipcode: '123456',
    state: 'Test State',
    city: 'Test City',
    mobile_number: '03001234567',
  };
}

// API 7 - Create Account
test('API 7 - Create a new account', async ({ request }) => {
  const accountApi = new AccountApi(request);
  const account = createAccountData();

  const response = await accountApi.createAccount(account);

  const body = await getApiJsonResponse(response, 'API 7');

  expect(response.status()).toBe(200);
  expect(body.responseCode).toBe(201);
  expect(body.message).toContain('User created');
});

// API 8 - Delete Account
test('API 8 - Delete an existing account', async ({ request }) => {
  const accountApi = new AccountApi(request);
  const account = createAccountData();

  // Create account first so API 8 has an account to delete
  const createResponse = await accountApi.createAccount(account);

  const createBody = await getApiJsonResponse(
    createResponse,
    'API 8 - Create account prerequisite'
  );

  expect(createResponse.status()).toBe(200);
  expect(createBody.responseCode).toBe(201);
  expect(createBody.message).toContain('User created');

  // Delete the newly created account
  const deleteResponse = await accountApi.deleteAccount(
    account.email,
    account.password
  );

  const deleteBody = await getApiJsonResponse(
    deleteResponse,
    'API 8 - Delete account'
  );

  expect(deleteResponse.status()).toBe(200);
  expect(deleteBody.responseCode).toBe(200);
  expect(deleteBody.message).toContain('Account deleted');
});
