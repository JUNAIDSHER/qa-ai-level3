
# AI-Assisted Root Cause Analysis (RCA)

## Purpose
This folder stores evidence, root cause analysis reports, and human-reviewed repair proposals for the Playwright automation project.

## Fault Injection Cases

### RCA-01: Intentional Locator Failure
- **Type:** UI automation fault
- **Objective:** Introduce an incorrect locator intentionally.
- **Expected symptom:** Playwright cannot locate the intended UI element.
- **Evidence:** Test output, error message, screenshot, and trace.
- **Analysis:** Identify the failed locator and explain why the test failed.
- **Repair proposal:** Restore a reliable locator based on the actual application UI.
- **Review status:** Pending human review.

### RCA-02: Intentional Assertion Failure
- **Type:** UI validation fault
- **Objective:** Introduce an incorrect expected value in a test assertion.
- **Expected symptom:** Playwright reports an assertion mismatch.
- **Evidence:** Test output, expected value, actual value, screenshot, and trace.
- **Analysis:** Identify the incorrect expectation and explain the failure.
- **Repair proposal:** Correct the assertion using verified application behavior.
- **Review status:** Pending human review.

## RCA Workflow
1. Inject one controlled fault.
2. Run the affected test.
3. Capture failure evidence.
4. Analyze the error and identify the root cause.
5. Prepare a repair proposal.
6. Review the proposed repair manually.
7. Apply the approved repair.
8. Rerun the affected test and confirm the result.

## Safety Rules
- Never inject faults into production systems.
- Use only the local test code and controlled test environment.
- Keep original test files recoverable through Git.
- Never treat an AI-generated repair as automatically approved.
- Preserve failure evidence before applying a repair.

## Reports
Detailed RCA reports and supporting evidence will be stored in this folder.
