
import { test, expect, APIResponse } from '@playwright/test';
import { AccountApi } from '../../src/api/AccountApi';

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
    mobile_number: '03001234567'
  };
}

/**
 * Reads and validates the API response body.
 * The server may return valid JSON with an incorrect Content-Type header.
 * Invalid JSON (including HTML challenge pages) still fails the test.
 */
async function getJsonResponse(
  response: APIResponse,
  apiName: string
) {
  const contentType = response.headers()['content-type'] || '';
  const responseText = await response.text();

  console.log(`${apiName} Status:`, response.status());
  console.log(`${apiName} Content-Type:`, contentType);
  console.log(`${apiName} Response:`, responseText.slice(0, 1000));

  if (!contentType.toLowerCase().includes('application/json')) {
    console.warn(
      `${apiName}: Non-JSON Content-Type received: ${contentType}`
    );
  }

  let body: any;

  try {
    body = JSON.parse(responseText);
  } catch {
    throw new Error(
      `${apiName} returned invalid JSON. ` +
      `HTTP Status: ${response.status()}. ` +
      `Content-Type: ${contentType}. ` +
      `Response: ${responseText.slice(0, 1000)}`
    );
  }

  return body;
}

// API 7 - Create Account
test('API 7 - Create a new account', async ({ request }) => {
  const accountApi = new AccountApi(request);
  const account = createAccountData();

  const response = await accountApi.createAccount(account);

  expect(response.status()).toBe(200);

  const body = await getJsonResponse(response, 'API 7');

  expect(body.responseCode).toBe(201);
  expect(body.message).toContain('User created');
});

// API 8 - Delete Account
test('API 8 - Delete an existing account', async ({ request }) => {
  const accountApi = new AccountApi(request);
  const account = createAccountData();

  // Create account first so API 8 has an account to delete
  const createResponse = await accountApi.createAccount(account);

  expect(createResponse.status()).toBe(200);

  const createBody = await getJsonResponse(
    createResponse,
    'API 8 - Create account prerequisite'
  );

  expect(createBody.responseCode).toBe(201);
  expect(createBody.message).toContain('User created');

  // Delete the newly created account
  const deleteResponse = await accountApi.deleteAccount(
    account.email,
    account.password
  );

  expect(deleteResponse.status()).toBe(200);

  const deleteBody = await getJsonResponse(
    deleteResponse,
    'API 8 - Delete account'
  );

  expect(deleteBody.responseCode).toBe(200);
  expect(deleteBody.message).toContain('Account deleted');
});
