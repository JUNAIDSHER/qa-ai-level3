
# Skill: Playwright Root Cause Analysis

## Purpose
Analyze Playwright test failures and prepare evidence-based root cause analysis reports.

## Inputs
- Playwright error logs
- Error context files
- Failure screenshots
- Playwright trace files
- Test source code

## Analysis Workflow

### Step 1: Identify the Failure
Classify the failure as one of:
- Locator failure
- Assertion failure
- Timeout failure
- Network failure
- Test data failure
- Application failure
- Unknown failure

### Step 2: Examine Evidence
- Read the complete error message.
- Identify the failed test and source line.
- Inspect the screenshot when available.
- Inspect the trace when available.
- Compare expected and actual behavior.

### Step 3: Determine Root Cause
- Explain what failed.
- Identify the most likely reason.
- Separate confirmed facts from assumptions.
- Do not blame the application without evidence.

### Step 4: Prepare Repair Proposal
- Suggest the smallest safe correction.
- Explain why the correction is appropriate.
- Do not modify source code automatically.
- Do not hide failures with unnecessary retries.

### Step 5: Human Review
Every repair proposal must include:
- Proposed change
- Supporting evidence
- Potential impact
- Validation steps
- Human approval status

## Safety Rules
1. Never modify application or test code without human approval.
2. Never report a test as passed when it failed.
3. Preserve original failure evidence.
4. Never invent missing evidence.
5. Do not expose passwords, tokens or secrets.
6. Validate every approved repair with a test rerun.

## Expected Output
A structured RCA report containing:
- Incident summary
- Failure classification
- Root cause
- Evidence
- Repair proposal
- Human review status
- Validation result
