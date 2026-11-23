# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\login-negative.spec.ts >> AE-03: User cannot login with invalid credentials
- Location: tests\ui\login-negative.spec.ts:5:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Login successful!')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Login successful!') with timeout 5000ms
  - waiting for getByText('Login successful!')

```

```yaml
- banner:
  - link "Website for automation practice":
    - /url: /
    - img "Website for automation practice"
  - list:
    - listitem:
      - link " Home":
        - /url: /
    - listitem:
      - link " Products":
        - /url: /products
    - listitem:
      - link " Cart":
        - /url: /view_cart
    - listitem:
      - link " Signup / Login":
        - /url: /login
    - listitem:
      - link " Test Cases":
        - /url: /test_cases
    - listitem:
      - link " API Testing":
        - /url: /api_list
    - listitem:
      - link " Video Tutorials":
        - /url: https://www.youtube.com/c/AutomationExercise
    - listitem:
      - link " Contact us":
        - /url: /contact_us
- heading "Login to your account" [level=2]
- textbox "Email Address": invalid.user.12345@example.com
- textbox "Password": WrongPassword@123
- paragraph: Your email or password is incorrect!
- button "Login"
- heading "OR" [level=2]
- heading "New User Signup!" [level=2]
- textbox "Name"
- textbox "Email Address"
- button "Signup"
- contentinfo:
  - heading "Subscription" [level=2]
  - textbox "Your email address"
  - button ""
  - paragraph:
    - text: Get the most recent updates from our site and be updated your self...
    - link "Browse Reference":
      - img
      - text: Browse Reference
  - paragraph: Copyright © 2021 All rights reserved
- insertion:
  - heading "These are topics related to the article that might interest you" [level=2]: Discover more
  - link "Secure Networks"
  - link "Audit Security"
  - link "Try Cloud Tools"
```

# Test source

```ts
  1  | 
  2  | import { test, expect } from '@playwright/test';
  3  | import { LoginPage } from '../../src/pages/LoginPage';
  4  | 
  5  | test('AE-03: User cannot login with invalid credentials', async ({ page }) => {
  6  |   const loginPage = new LoginPage(page);
  7  | 
  8  |   // Test data: invalid credentials
  9  |   const email = 'invalid.user.12345@example.com';
  10 |   const password = 'WrongPassword@123';
  11 | 
  12 |   // Step 1: Open login page
  13 |   await loginPage.open();
  14 | 
  15 |   // Step 2: Verify login form
  16 |   await expect(loginPage.loginHeading).toBeVisible();
  17 | 
  18 |   // Step 3: Enter invalid credentials
  19 |   await loginPage.login(email, password);
  20 | 
  21 |   // Step 4: Verify error message
  22 |   await expect(
  23 |     page.getByText('Login successful!')
> 24 |   ).toBeVisible();
     |     ^ Error: expect(locator).toBeVisible() failed
  25 | 
  26 |   // Step 5: Verify user is not logged in
  27 |   await expect(
  28 |     page.getByText('Logged in as')
  29 |   ).toHaveCount(0);
  30 | });
  31 | 
```