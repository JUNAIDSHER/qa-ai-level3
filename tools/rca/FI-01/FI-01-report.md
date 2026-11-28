# FI-01: Intentional Script Locator Fault

## 1. Incident Summary
- **Fault ID:** FI-01
- **Category:** Script fault / Incorrect locator
- **Browser:** Chromium
- **Test:** User can search for a product
- **File:** `src/pages/ProductsPage.ts`
- **Result:** Expected failure reproduced

## 2. Fault Injection
The original locator:

`#search_product`

was intentionally replaced with:

`#search_product_injected_fault`

This introduced a controlled incorrect locator in the ProductsPage Page Object.

## 3. Observed Failure
- **Error:** TimeoutError
- **Operation:** `locator.waitFor()`
- **Expected state:** visible
- **Actual result:** locator not found
- **Timeout:** 15000 ms
- **Failure location:** `ProductsPage.open()`

## 4. Evidence
Failure evidence:
- `evidence/ui-products-User-can-search-for-a-product-chromium/test-failed-1.png`
- `evidence/ui-products-User-can-search-for-a-product-chromium/video.webm`
- `evidence/ui-products-User-can-search-for-a-product-chromium/error-context.md`
- `evidence/ui-products-User-can-search-for-a-product-chromium/trace.zip`

## 5. Root Cause
The test could not locate the search input because the Page Object contained an intentionally incorrect CSS selector.

This was a test automation script fault, not a confirmed application defect.

## 6. Repair Proposal
Restore the verified selector:

`#search_product`

The original locator was restored in `src/pages/ProductsPage.ts`.

## 7. Human Review
- **Review status:** Reviewed and approved by project owner
- **Repair:** Original locator restored
- **Validation browser:** Chromium
- **Validation result:** PASS — 1 test passed
- **Validation output:** `validation/`

## 8. Repair Validation Details

The repaired locator was validated using the following command:

```powershell
npx playwright test tests/ui/products.spec.ts --grep "User can search for a product" --project=chromium --workers=1
```

**Actual test result:**
```text
Running 1 test using 1 worker

✓ [chromium] tests\ui\products.spec.ts:6:1
  User can search for a product (7.0s)

1 passed (8.1s)
```

- **Test status:** PASS
- **Passed:** 1
- **Failed:** 0
- **Browser:** Chromium

## 9. Conclusion
The controlled script fault was successfully reproduced and classified as a test automation script fault. Failure evidence was preserved, the incorrect locator was restored to `#search_product`, and the targeted Chromium test passed after repair.

The repair is validated by the targeted test. Full-suite regression validation is a separate step.

### Preserved Evidence
- `evidence/ui-products-User-can-search-for-a-product-chromium/test-failed-1.png`
- `evidence/ui-products-User-can-search-for-a-product-chromium/video.webm`
- `evidence/ui-products-User-can-search-for-a-product-chromium/error-context.md`
- `evidence/ui-products-User-can-search-for-a-product-chromium/trace.zip`