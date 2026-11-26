# FI-02: Controlled Network / State Fault

## 1. Incident Summary
- Fault ID: FI-02
- Category: Network / State fault
- Browser: Chromium
- Test: Controlled HTTP 503 network failure during product search
- File: tests/ui/fault-injection-fi02.spec.ts
- Result: Expected failure reproduced

## 2. Fault Injection
Playwright page.route() intercepted the product search request and returned HTTP 503 Service Unavailable.

## 3. Observed Failure
- Assertion: Searched Products heading visibility
- Expected: Visible
- Actual: Element not found
- Timeout: 10000 ms
- Failure type: Controlled network/state failure

## 4. Evidence
- evidence/ui-fault-injection-fi02-FI-3b72c-ilure-during-product-search-chromium/test-failed-1.png
- evidence/ui-fault-injection-fi02-FI-3b72c-ilure-during-product-search-chromium/video.webm
- evidence/ui-fault-injection-fi02-FI-3b72c-ilure-during-product-search-chromium/error-context.md
- evidence/ui-fault-injection-fi02-FI-3b72c-ilure-during-product-search-chromium/trace.zip

## 5. Root Cause
The intercepted search request received HTTP 503 instead of a normal product search response. Consequently, the expected search results heading was not rendered.

This was an intentionally injected network fault, not a confirmed application defect.

## 6. Recovery and Validation
The fault is isolated to the FI-02 test. The normal product-search test was executed without fault injection and passed.

- Validation command: npx playwright test tests/ui/products.spec.ts --grep "User can search for a product" --project=chromium --workers=1
- Validation result: 1 passed
- Browser: Chromium

## 7. Human Review
- Review status: Pending human review
- Reviewer decision: Pending
- Repair approval: Pending

## 8. Conclusion
The controlled HTTP 503 fault was reproduced successfully and diagnostic evidence was captured. Normal product search passed without the injected fault.
- evidence/ui-fault-injection-fi02-FI-3b72c-ilure-during-product-search-chromium/video.webm
