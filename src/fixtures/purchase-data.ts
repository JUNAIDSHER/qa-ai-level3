
import type { AccountDetails } from '../pages/AccountInformationPage';

const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

const randomNumber = Math.floor(1000 + Math.random() * 9000);

const randomPassword = `Qa@${uniqueId}Test!`;

const randomDigits = (length: number) =>
  Array.from(
    { length },
    () => Math.floor(Math.random() * 10)
  ).join('');

export const purchaseUser = {
  name: `QA User ${uniqueId}`,
  email: `qa.purchase.${uniqueId}@example.com`,

  account: {
    password: randomPassword,
    firstName: `First${uniqueId}`,
    lastName: `Last${randomNumber}`,
    address: `${randomNumber} Test Street`,
    country: 'India',
    state: `State${randomNumber}`,
    city: `City${randomNumber}`,
    zipcode: String(100000 + Math.floor(Math.random() * 900000)),
    mobile: `0300${String(randomNumber).padStart(7, '0')}`
  } satisfies AccountDetails
};

export const purchasePayment = {
  nameOnCard: `QA Tester ${randomDigits(4)}`,
  cardNumber: '4111111111111111',
  cvc: randomDigits(3),
  expiryMonth: String(
    Math.floor(1 + Math.random() * 12)
  ).padStart(2, '0'),
  expiryYear: String(
    2028 + Math.floor(Math.random() * 5)
  )
};
