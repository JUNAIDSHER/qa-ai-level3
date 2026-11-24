![Playwright Tests](https://github.com/JUNAIDSHER/qa-ai-level3/actions/workflows/playwright.yml/badge.svg)

# QA Automation Framework – Playwright

A robust end-to-end test automation framework built with **Playwright and TypeScript**, designed to validate UI workflows and REST API functionality of the [Automation Exercise](https://automationexercise.com/) website.

The framework follows the **Page Object Model (POM)** design pattern and supports cross-browser testing with Chromium and Firefox.

## Project Highlights

- UI end-to-end automation
- REST API testing
- Page Object Model architecture
- Cross-browser execution
- Reusable test fixtures and test data
- Positive and negative test scenarios
- Screenshot and test-report support
- GitHub Actions CI integration

## Tech Stack

| Technology | Purpose |
|---|---|
| Playwright | Browser and API automation |
| TypeScript | Programming language |
| Node.js | Runtime environment |
| GitHub Actions | Continuous Integration |
| Page Object Model | Test architecture |

## Project Structure

```text
qa-ai-level3/
│
├── src/
│   ├── api/
│   │   └── AuthApi.ts
│   │
│   ├── fixtures/
│   │   └── purchase-data.ts
│   │
│   └── pages/
│       ├── SignupPage.ts
│       ├── AccountInformationPage.ts
│       ├── ProductsPage.ts
│       ├── LoginPage.ts
│       └── CategoryPage.ts
│
├── tests/
│   ├── api/
│   │   ├── auth-api.spec.ts
│   │   ├── account-api.spec.ts
│   │   └── products-api.spec.ts
│   │
│   └── ui/
│       ├── purchase-journey.spec.ts
│       ├── login.spec.ts
│       ├── category-navigation.spec.ts
│       ├── scroll.spec.ts
│       ├── signup-duplicate.spec.ts
│       ├── cart.spec.ts
│       ├── products.spec.ts
│       ├── products-negative.spec.ts
│       ├── login-negative.spec.ts
│       └── signup.spec.ts
│
├── playwright.config.ts
├── package.json
└── README.md
```

## Test Coverage

### UI Automation
- User registration
- Login and logout
- Duplicate email validation
- Product search
- Category navigation
- Cart functionality
- Scrolling and navigation
- Complete purchase journey
- Guest checkout
- Payment and invoice download

### API Automation
- Authentication API
- Account API
- Products API
- Positive and negative API scenarios

## Browser Support

Tests are configured to run on:

- Chromium
- Firefox

## Installation

Clone the repository:

```bash
git clone https://github.com/JUNAIDSHER/qa-ai-level3.git
```

Navigate to the project:

```bash
cd qa-ai-level3
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

## Running Tests

Run the complete test suite:

```bash
npx playwright test
```

Run tests on Chromium:

```bash
npx playwright test --project=chromium
```

Run tests on Firefox:

```bash
npx playwright test --project=firefox
```

Run tests with one worker:

```bash
npx playwright test --workers=1
```

Run a specific test file:

```bash
npx playwright test tests/ui/login.spec.ts
```

## Test Reports

Open the Playwright HTML report:

```bash
npx playwright show-report
```

## Continuous Integration

This project integrates with **GitHub Actions** to execute automated tests in CI.

The workflow runs the Playwright test suite and reports the execution status directly on GitHub.

**Latest verified status:** All 58 tests passed locally, and the GitHub Actions workflow completed successfully.

## Architecture

The framework uses the Page Object Model design pattern.

- Page classes contain reusable locators and page actions.
- Test files contain test scenarios and assertions.
- Fixtures provide reusable test setup and test data.
- API classes organize API-related operations.

This separation improves maintainability, readability and reusability.

## Author

**Junaid Sher**

GitHub: [JUNAIDSHER](https://github.com/JUNAIDSHER)

---

*This project demonstrates practical skills in UI automation, API testing, TypeScript, Playwright, cross-browser testing and CI/CD integration.*