# FI-01: Intentional Script Locator Fault

## 1. Incident Summary
- Fault ID: FI-01
- Category: Script fault / Incorrect locator
- Browser: Chromium
- Test: User can search for a product
- File: src/pages/ProductsPage.ts
- Result: Expected failure reproduced

## 2. Fault Injection
The original locator:

`#search_product`

was intentionally replaced with:

`#search_product_injected_fault`

This introduced a controlled incorrect locator in the ProductsPage Page Object.

## 3. Observed Failure
- Error: TimeoutError
- Operation: locator.waitFor()
- Expected state: visible
- Actual result: locator not found
- Timeout: 15000 ms
- Failure location: ProductsPage.open()

## 4. Evidence
Failure evidence:
- evidence/ui-products-User-can-search-for-a-product-chromium/test-failed-1.png
- evidence/ui-products-User-can-search-for-a-product-chromium/video.webm
- evidence/ui-products-User-can-search-for-a-product-chromium/error-context.md
- evidence/ui-products-User-can-search-for-a-product-chromium/trace.zip

## 5. Root Cause
The test could not locate the search input because the Page Object contained an intentionally incorrect CSS selector.

This was a test automation script fault, not a confirmed application defect.

## 6. Repair Proposal
Restore the verified selector:

`#search_product`

## 7. Human Review
- Review status: Reviewed and approved by project owner
- Repair: Original locator restored
- Validation browser: Chromium
- Validation result: 1 passed
- Validation output: validation/

## 8. Conclusion
The controlled script fault was detected successfully. Failure evidence was preserved, the original locator was restored, and the targeted test passed after repair.

- evidence/ui-products-User-can-search-for-a-product-chromium/video.webm
