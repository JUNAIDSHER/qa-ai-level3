# Automated Scenario Catalogue — AE-01 to AE-24

**Project:** AI Level-3 Quality Engineering  
**Date:** 28 November 2026  
**Status:** 19 implemented UI scenarios; 5 proposed scenarios pending implementation.

## Status definitions

- **IMPLEMENTED:** Test exists in the repository and is listed as locally passing in the current traceability matrix.
- **NOT IMPLEMENTED:** Proposed coverage; no executable test has been verified.
- **Execution note:** Passing status refers to the recorded local test execution, not a new execution performed while preparing this catalogue.

## Functional areas

1. Account registration
2. Authentication and authorization
3. Product search
4. Category navigation
5. Shopping cart
6. Checkout and purchase
7. Website navigation and subscription

## Scenario catalogue

| ID | Functional area | Scenario | Priority | Preconditions / test data | Expected result | Automation reference | Status |
|---|---|---|---|---|---|---|---|
| AE-01 | Registration | Create and delete a new account | High | Unique generated account data | Account is created and subsequently deleted | `tests/ui/signup.spec.ts` — User can create and delete an account | IMPLEMENTED |
| AE-02 | Authentication | Login and logout successfully | High | Valid account credentials | User login succeeds and logout returns user to logged-out state | `tests/ui/login.spec.ts` — User can login and logout successfully | IMPLEMENTED |
| AE-03 | Authentication | Reject invalid login credentials | High | Invalid email/password | Login is rejected and an error is displayed | `tests/ui/login-negative.spec.ts` — User cannot login with invalid credentials | IMPLEMENTED |
| AE-04 | Registration | Reject duplicate email registration | High | Existing registered email | Duplicate registration is rejected | `tests/ui/signup-duplicate.spec.ts` — User cannot register with an already registered email | IMPLEMENTED |
| AE-05 | Authorization | Prevent logged-out access to account page | High | Logged-out browser session | Account page access is prevented | `tests/ui/login.spec.ts` — Logged out user cannot access account page | IMPLEMENTED |
| AE-06 | Authentication | Navigate to login page | Medium | Homepage available | Login page opens successfully | `tests/ui/login.spec.ts` — User can navigate to login page from homepage | IMPLEMENTED |
| AE-07 | Authentication | Validate empty login form submission | Medium | Login form open; empty fields | Required-field validation is shown | `tests/ui/login.spec.ts` — Login form validates empty fields | IMPLEMENTED |
| AE-08 | Product search | Search for an existing product | High | Product catalogue available; Blue Top search | Matching product results are displayed | `tests/ui/products.spec.ts` — User can search for a product | IMPLEMENTED |
| AE-09 | Product search | Search for a non-existing product | Medium | Search term with no matching product | No matching products are shown | `tests/ui/products-negative.spec.ts` — Searching for a non-existing product shows no results | IMPLEMENTED |
| AE-10 | Category navigation | Navigate to Women Tops category | Medium | Homepage and category menu available | Women Tops category opens | `tests/ui/category-navigation.spec.ts` — User can navigate to Women Tops category | IMPLEMENTED |
| AE-11 | Category navigation | Navigate to Men Tshirts category | Medium | Homepage and category menu available | Men Tshirts category opens | `tests/ui/category-navigation.spec.ts` — User can navigate to Men Tshirts category | IMPLEMENTED |
| AE-12 | Shopping cart | Add two products with specified quantities | High | Blue Top and Men Tshirt available | Both products are added to cart | `tests/ui/cart.spec.ts` — User can add two products to cart with correct quantities | IMPLEMENTED |
| AE-13 | Shopping cart | Verify product quantity in cart | High | Product already added to cart | Displayed quantity matches selected quantity | `tests/ui/cart.spec.ts` — User can verify product quantity in cart | IMPLEMENTED |
| AE-14 | Shopping cart | Remove a product from cart | Medium | Cart contains a product | Selected product is removed | `tests/ui/cart.spec.ts` — User can remove a product from cart | IMPLEMENTED |
| AE-15 | Checkout | Complete full purchase journey | Critical | Unique generated account, products and dummy payment fixture | Cart quantities and totals, addresses, order confirmation and invoice download are verified; account deletion is attempted | `tests/ui/purchase-journey.spec.ts` — Complete purchase journey with a unique test account | IMPLEMENTED |
| AE-16 | Checkout | Require guest registration before checkout | High | Logged-out guest and product in cart | Guest is prompted to register or log in | `tests/ui/purchase-journey.spec.ts` — UI 13 - Guest user is prompted to register before checkout | IMPLEMENTED |
| AE-17 | Navigation | Navigate to Cart page | Medium | Homepage available | Cart page opens successfully | `tests/ui/login.spec.ts` — User can navigate to Cart page from homepage | IMPLEMENTED |
| AE-18 | Subscription | Verify footer subscription form | Low | Homepage available | Footer subscription form is visible | `tests/ui/footer-subscription.spec.ts` — Footer subscription form is visible | IMPLEMENTED |
| AE-19 | Navigation | Scroll homepage to bottom and back to top | Low | Homepage available | Page reaches bottom and returns to top | `tests/ui/scroll.spec.ts` — User can scroll homepage to bottom and back to top | IMPLEMENTED |
| AE-20 | Registration | Validate malformed email address | Medium | Registration form and malformed email input | Invalid email is rejected | Proposed; no verified test reference | NOT IMPLEMENTED |
| AE-21 | Authentication | Verify password recovery flow | Medium | Registered email account | Recovery flow gives the expected response | Proposed; no verified test reference | NOT IMPLEMENTED |
| AE-22 | Shopping cart | Verify cart remains consistent after page refresh | Medium | Cart contains selected products | Cart contents and quantities remain consistent | Proposed; no verified test reference | NOT IMPLEMENTED |
| AE-23 | Checkout | Verify invoice product details and order values | High | Completed order and downloaded invoice | Invoice content matches expected order details | Proposed; current test only verifies filename and non-empty file | NOT IMPLEMENTED |
| AE-24 | Checkout | Verify cleanup recovery when account deletion fails | High | Disposable account and simulated cleanup failure | Failure is recorded and recovery/manual cleanup is documented | Proposed; no dedicated verified test reference | NOT IMPLEMENTED |

## Risk and execution priorities

| Priority | Execution focus |
|---|---|
| Critical | AE-15 complete purchase journey |
| High | AE-01, AE-02, AE-03, AE-04, AE-05, AE-08, AE-12, AE-13, AE-16, AE-23, AE-24 |
| Medium | AE-06, AE-07, AE-09, AE-10, AE-11, AE-14, AE-17, AE-20, AE-21, AE-22 |
| Low | AE-18, AE-19 |

## Negative and edge coverage

Implemented negative or edge scenarios include:

- AE-03: Invalid login credentials.
- AE-04: Duplicate account registration.
- AE-05: Unauthorized account access.
- AE-07: Empty login submission.
- AE-09: Product search with no matching result.
- AE-16: Guest checkout registration requirement.

The proposed scenarios AE-20 to AE-24 are additional coverage and must not be counted as implemented tests.

## Flagship purchase journey notes

The current purchase test verifies:

- Unique test account generation.
- Blue Top quantity of four.
- A second product, Men Tshirt.
- Product quantities, unit prices and line-total arithmetic.
- Combined cart total arithmetic.
- Delivery and billing address values against the generated fixture.
- Dummy payment form submission.
- Order confirmation.
- Invoice download, filename and non-empty file.
- Account deletion attempt in a `finally` block.

**Known limitations:**

- Invoice content is not yet checked against order details.
- Account cleanup can fail and require manual intervention.
- Cleanup failure is logged and a screenshot is attempted.

## API coverage

API scenarios are tracked separately in `docs/traceability-matrix.md`:

- API-01 to API-03: Product API.
- API-04 to API-06: Authentication API.
- API-07 to API-08: Account API.

The current traceability matrix records eight API scenarios, with 16 browser test instances across Chromium and Firefox.

## Evidence and limitations

- Test references are based on the repository test inventory.
- Local execution results are recorded in `docs/traceability-matrix.md`.
- FI-02 is an opt-in fault-injection test, not normal business-flow coverage.
- FI-01 is supported by historical fault-injection evidence.
- Proposed scenarios require implementation and execution before they can be marked passing.
- This catalogue does not claim that all 24 scenarios are implemented.

## Completion criteria

Before marking this catalogue fully complete:

1. Implement and execute AE-20 to AE-24, or formally approve their exclusion.
2. Verify invoice content, not only file existence.
3. Improve and document cleanup recovery.
4. Reconcile this catalogue with `docs/traceability-matrix.md`.
5. Attach execution evidence for each implemented scenario.
