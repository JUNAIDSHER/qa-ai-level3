# AI-Assisted Root Cause Analysis (RCA)

## Purpose

This folder stores evidence, root cause analysis reports, and human-reviewed repair proposals for the Playwright automation project.

## Fault Injection Cases

### FI-01: Intentional Locator Failure

- **Type:** UI test-script fault
- **Objective:** Introduce an incorrect locator intentionally.
- **Expected symptom:** Playwright cannot locate the intended UI element.
- **Evidence:** Test output, error message, screenshot, and trace.
- **Analysis:** Identify the failed locator and explain why the test failed.
- **Repair proposal:** Restore a reliable locator based on the actual application UI.
- **Evidence status:** Historical fault and repair evidence available; no dedicated repeatable FI-01 test currently exists.
- **Review status:** Human approval required before applying a repair.

### FI-02: Controlled Network Failure (HTTP 503)

- **Type:** External dependency / network failure
- **Objective:** Simulate an HTTP 503 response during product search.
- **Expected symptom:** The application displays or receives a service-unavailable response.
- **Evidence:** Test output, error context, screenshot, video, and trace.
- **Analysis:** Identify the injected HTTP 503 response and distinguish it from a test-script locator or assertion fault.
- **Repair proposal:** Investigate service availability and retry behavior; do not modify application code solely because of an injected external failure.
- **Execution:** Dedicated opt-in test at `tests/ui/fault-injection-fi02.spec.ts`.
- **Review status:** Human approval required before accepting any repair proposal.

## RCA Workflow

1. Inject one controlled fault in a test environment.
2. Run the affected test.
3. Capture failure evidence.
4. Analyze the error and identify the likely root cause.
5. Prepare a repair proposal supported by evidence.
6. Review the proposed repair manually.
7. Apply the repair only after human approval.
8. Rerun the affected test and confirm the result.

## Safety Rules

- Never inject faults into production systems.
- Use only local test code and a controlled test environment.
- Keep original test files recoverable through Git.
- Never treat an AI-generated repair as automatically approved.
- Preserve failure evidence before applying a repair.
- Do not bypass external anti-bot protections.
- Treat unknown failures as unconfirmed until supported by evidence.

## Reports

Detailed RCA reports and supporting evidence are stored in the corresponding FI-01 and FI-02 folders.

Generated RCA summaries are stored under `reports/rca/`. These reports may contain diagnostic information and should be reviewed before sharing.