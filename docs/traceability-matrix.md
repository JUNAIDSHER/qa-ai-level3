# Requirements Traceability Matrix

**Project:** AI Level-3 Quality Engineering – Playwright + Agentic RCA  
**Last updated:** 28 November 2026  
**Status:** Provisional – pending comparison with the original assignment PDF.

## 1. Purpose

This matrix maps the currently implemented and verified automated tests to the functional areas they cover. It also records fault-injection, CI and RCA requirements separately so that historical evidence is not confused with repeatable automated coverage.

## 2. UI Test Coverage

| ID | Requirement / Scenario | Test file | Verification |
|---|---|---|---|
| UI-01 | Create a new user account and delete it | `tests/ui/signup.spec.ts` | Verified – passed |
| UI-02 | Reject duplicate email registration | `tests/ui/signup-duplicate.spec.ts` | Verified – passed |
| UI-03 | Reject invalid login credentials | `tests/ui/login-negative.spec.ts` | Verified – passed |
| UI-04 | Login and logout successfully | `tests/ui/login.spec.ts` | Verified – passed |
| UI-05 | Prevent logged-out users from accessing account | `tests/ui/login.spec.ts` | Verified – passed |
| UI-06 | Navigate to login page | `tests/ui/login.spec.ts` | Verified – passed |
| UI-07 | Validate empty login submission | `tests/ui/login.spec.ts` | Verified – passed |
| UI-08 | Search for an existing product | `tests/ui/products.spec.ts` | Verified – passed |
| UI-09 | Handle a search with no matching product | `tests/ui/products-negative.spec.ts` | Verified – passed |
| UI-10 | Navigate to Women Tops category | `tests/ui/category-navigation.spec.ts` | Verified – passed |
| UI-11 | Navigate to Men Tshirts category | `tests/ui/category-navigation.spec.ts` | Verified – passed |
| UI-12 | Add products to cart | `tests/ui/cart.spec.ts` | Verified – passed |
| UI-13 | Update cart item quantity | `tests/ui/cart.spec.ts` | Verified – passed |
| UI-14 | Remove an item from cart | `tests/ui/cart.spec.ts` | Verified – passed |
| UI-15 | Complete purchase journey with a unique account | `tests/ui/purchase-journey.spec.ts` | Verified – passed |
| UI-16 | Prompt guest user to register before checkout | `tests/ui/purchase-journey.spec.ts` | Verified – passed |
| UI-17 | Navigate to cart | `tests/ui/login.spec.ts` | Verified – passed |
| UI-18 | Verify footer subscription form is visible | `tests/ui/footer-subscription.spec.ts` | Verified – passed |
| UI-19 | Verify page scrolling behavior | `tests/ui/scroll.spec.ts` | Verified – passed |

**UI coverage note:** The 19 scenarios above exclude the browser diagnostic test and the opt-in FI-02 fault-injection test. The normal UI suite also includes both Chromium and Firefox execution.

## 3. API Test Coverage

| ID | Requirement / Scenario | Test file | Verification |
|---|---|---|---|
| API-01 | Retrieve products list | `tests/api/products-api.spec.ts` | Verified – passed |
| API-02 | Search products | `tests/api/products-api.spec.ts` | Verified – passed |
| API-03 | Handle product search without parameter | `tests/api/products-api.spec.ts` | Verified – passed |
| API-04 | Login with valid credentials | `tests/api/auth-api.spec.ts` | Verified – passed |
| API-05 | Handle login request without email | `tests/api/auth-api.spec.ts` | Verified – passed |
| API-06 | Handle invalid login credentials | `tests/api/auth-api.spec.ts` | Verified – passed |
| API-07 | Create a user account through API | `tests/api/account-api.spec.ts` | Verified – passed |
| API-08 | Delete a user account through API | `tests/api/account-api.spec.ts` | Verified – passed |

**API execution evidence:** 16 test instances passed locally across Chromium and Firefox (8 scenarios per browser). Application response codes are validated from parsed response bodies; these should not be confused with the transport HTTP status.

## 4. Fault Injection and RCA Traceability

| ID | Requirement | Evidence / Location | Status |
|---|---|---|---|
| FI-01 | Demonstrate a test-script / incorrect-locator fault | `tools/rca/FI-01/FI-01-report.md` and `reports/rca/FI-01-input.md` | Historical fault and repair evidence available; no dedicated repeatable FI-01 test currently present |
| FI-02 | Demonstrate a controlled network failure (HTTP 503) | `tests/ui/fault-injection-fi02.spec.ts` and `tools/rca/FI-02/` | Dedicated opt-in test exists; excluded from normal suite |
| RCA-01 | Generate AI-assisted RCA for FI-01 | `reports/rca/FI-01-ai-assisted-summary.json` and `.md` | Gemini analysis completed; human review required |
| RCA-02 | Generate AI-assisted RCA for FI-02 | `reports/rca/FI-02-ai-assisted-summary.json` and `.md` | Gemini analysis completed; human review required |
| RCA-03 | Provide deterministic fallback when AI analysis is unavailable | `agents/rca-agent.ts` and `reports/rca/FI-02-fallback-summary.*` | FI-02 fallback execution verified |
| RCA-04 | Require human review before accepting RCA repair | RCA summaries | Human approval required; no automatic code repair |

## 5. CI and Execution Traceability
| ID | Requirement | Evidence / Location | Status |
|---|---|---|---|
| CI-01 | Trigger workflow on push, pull request, manual dispatch and scheduled execution | `.github/workflows/playwright.yml` | Configured; hosted execution not independently verified |
| CI-02 | Install Node.js 22, dependencies and Chromium/Firefox browsers | `.github/workflows/playwright.yml` | Configured |
| CI-03 | Execute UI tests in CI | `.github/workflows/playwright.yml` | Configured |
| CI-04 | Execute API tests in CI | `.github/workflows/playwright.yml` | Configured |
| CI-05 | Generate deterministic RCA summaries | `npm run rca:collect` | Configured |
| CI-06 | Preserve Playwright reports and test artifacts | `.github/workflows/playwright.yml` | Configured; 14-day retention |
| CI-07 | Verify successful hosted GitHub Actions execution | GitHub Actions run #27 (`46111099662`) | Verified – successful hosted execution on commit `c6dff493381fb17f6587e6c02afbdb52527f3985`; subsequent local changes are not included |

## 6. Local Execution Evidence

| Check | Command | Latest result |
|---|---|---|
| TypeScript validation | `npx tsc --noEmit` | Passed |
| Complete Playwright suite | `npx playwright test --workers=1` | 58 passed, 2 skipped, 0 failed |
| Deterministic RCA collection | `npm run rca:collect` | Passed; no failures recorded |
| Whitespace validation | `git diff --check` | No whitespace errors; line-ending warning only |

## 7. Limitations and Review Notes

- This matrix is provisional until compared with the original assignment PDF.
- FI-02 is excluded from normal test execution and requires explicit opt-in.
- FI-01 is supported by historical fault-injection evidence rather than a dedicated repeatable test.
- Gemini-assisted RCA is available locally but is not executed by the current CI workflow.
- Successful local execution does not establish successful hosted CI execution.