
# RCA-02: Intentional Invalid Login Assertion Failure

## 1. Incident Summary
- **Fault ID:** RCA-02
- **Category:** UI Automation / Assertion Failure
- **Browser:** Chromium
- **Test:** AE-03 - User cannot login with invalid credentials
- **File:** tests/ui/login-negative.spec.ts
- **Result:** Failed as intentionally expected

## 2. Fault Injection
The original test expected the application to display:

`Your email or password is incorrect!`

For controlled fault injection, the expected message was intentionally changed to:

`Login successful!`

## 3. Observed Failure
Playwright reported:

- Assertion: `toBeVisible()`
- Locator: `getByText('Login successful!')`
- Expected: Visible
- Actual: Element not found
- Timeout: 5000 ms
- Failure location: Line 24

## 4. Root Cause Analysis
The test contained an intentionally incorrect expected message.

The application rejected the invalid credentials, but the test incorrectly expected a successful login message.

The failure was caused by the injected assertion fault, not by a confirmed application defect.

## 5. Evidence
The following evidence was preserved:

- `test-failed-1.png`
- `video.webm`
- `trace.zip`
- `error-context.md`

## 6. Proposed Repair
Restore the original assertion:

`Your email or password is incorrect!`

Retain the separate assertion verifying that the user is not logged in.

## 7. Human Review
- **Proposed repair:** Restore the original invalid-login error message.
- **Review status:** Reviewed and validated.
- **Reviewer decision:** Approved. The original assertion was restored and the Chromium test passed.
- **Validation result:** 1 passed.

## 8. Validation Plan
1. Restore the original expected error message.
2. Run the test in Chromium.
3. Confirm the test passes.
4. Record the validation result.

## 9. Conclusion
The controlled fault demonstrated that Playwright detects an incorrect expected login message and captures diagnostic evidence.

The proposed repair must be manually reviewed and validated before acceptance.
