
import { Page, Locator } from '@playwright/test';

export interface AccountDetails {
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
}

export class AccountInformationPage {
  readonly page: Page;

  readonly titleMr: Locator;
  readonly passwordInput: Locator;
  readonly daySelect: Locator;
  readonly monthSelect: Locator;
  readonly yearSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly offersCheckbox: Locator;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileInput: Locator;

  readonly createAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.titleMr = page.locator('#id_gender1');
    this.passwordInput = page.locator('#password');

    this.daySelect = page.locator('#days');
    this.monthSelect = page.locator('#months');
    this.yearSelect = page.locator('#years');

    this.newsletterCheckbox = page.locator('#newsletter');
    this.offersCheckbox = page.locator('#optin');

    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.addressInput = page.locator('#address1');
    this.countrySelect = page.locator('#country');
    this.stateInput = page.locator('#state');
    this.cityInput = page.locator('#city');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileInput = page.locator('#mobile_number');

    this.createAccountButton = page.locator(
      '[data-qa="create-account"]'
    );
  }

  async fillAccountInformation(
    details: AccountDetails = {
      password: 'TestPass@123',
      firstName: 'QA',
      lastName: 'Tester',
      address: '123 Test Street',
      country: 'India',
      state: 'Test State',
      city: 'Test City',
      zipcode: '123456',
      mobile: '03001234567'
    }
  ) {
    await this.titleMr.check();

    await this.passwordInput.fill(details.password);

    await this.daySelect.selectOption('10');
    await this.monthSelect.selectOption('5');
    await this.yearSelect.selectOption('1995');

    await this.newsletterCheckbox.check();
    await this.offersCheckbox.check();

    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.addressInput.fill(details.address);

    await this.countrySelect.selectOption({
      label: details.country
    });

    await this.stateInput.fill(details.state);
    await this.cityInput.fill(details.city);
    await this.zipcodeInput.fill(details.zipcode);
    await this.mobileInput.fill(details.mobile);
  }

  async createAccount() {
    await this.createAccountButton.click();
  }
}
