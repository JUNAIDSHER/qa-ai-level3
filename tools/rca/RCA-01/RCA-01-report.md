
# RCA-01: Intentional Product Locator Failure

## 1. Incident Summary
- **Fault ID:** RCA-01
- **Category:** UI Automation / Locator Failure
- **Browser:** Chromium
- **Test:** User can search for a product
- **File:** tests/ui/products.spec.ts
- **Result:** Failed as intentionally expected

## 2. Fault Injection
The original assertion expected the product name `Blue Top`.

For controlled fault injection, the expected text was intentionally changed to `Wrong Product Name`.

## 3. Observed Failure
Playwright reported:

- Assertion: `toBeVisible()`
- Locator: `getByText('Wrong Product Name', { exact: true }).first()`
- Expected: Visible
- Actual: Element not found
- Timeout: 5000 ms
- Failure location: Line 20

## 4. Root Cause Analysis
The test used an intentionally incorrect expected product name.

The product search flow reached the searched-products assertion, but the locator could not find an element matching `Wrong Product Name`.

The failure was caused by the injected test assertion fault, not by a confirmed application defect.

## 5. Evidence
The following evidence was preserved in this folder:

- `test-failed-1.png`
- `video.webm`
- `trace.zip`
- `error-context.md`

## 6. Proposed Repair
Restore the expected product name to `Blue Top`.

Keep the exact text assertion because it validates that the expected product is displayed after searching.

## 7. Human Review
- **Proposed repair:** Restore `Blue Top`.
- **Review status:** Reviewed and validated.
- **Reviewer decision:** Approved. The original `Blue Top` assertion was restored and the Chromium test passed.
- **Validation result:** 1 passed.

## 8. Validation Plan
1. Restore the original expected product name.
2. Run the test in Chromium.
3. Confirm that the test passes.
4. Record the validation result.

## 9. Conclusion
The controlled fault demonstrated that Playwright detects an incorrect expected product name and captures diagnostic evidence.

The proposed repair must be manually reviewed and validated before acceptance.
