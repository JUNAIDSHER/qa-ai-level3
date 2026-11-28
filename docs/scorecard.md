# QA Automation Framework – Execution Scorecard

## Latest Local Full Suite

| Metric | Result |
|---|---:|
| Total test instances | 60 |
| Passed | 58 |
| Failed | 0 |
| Skipped | 2 |
| Pass rate | 96.7% |
| Browsers | Chromium and Firefox |
| Workers | 4 |
| Execution time | Approximately 3.1 minutes |

The two skipped instances belong to the intentionally gated FI-02 network fault-injection test.

## Deterministic RCA

| Metric | Result |
|---|---|
| Classification | NO_FAILURES_RECORDED |
| Failed tests | 0 |
| External dependency failures | 0 |
| Human review required | No |
| Generated | 2026-11-28 12:41:20 UTC |
| Evidence | reports/rca/deterministic-summary.json |

## Additional Verification

| Check | Result |
|---|---|
| TypeScript validation | Passed |
| Three consecutive smoke runs | 48/48 passed |
| Smoke retries | 0 |
| GitHub Actions run #27 | Successful |
| FI-01 | Historical fault and repair evidence documented |
| FI-02 | Controlled HTTP 503 injection; normal suite gated |
| AI-assisted RCA | Tested locally; human review required |

## Known Limitations

- FI-02 is skipped during normal test execution.
- FI-02 human review remains pending.
- Gemini-based RCA is not integrated into GitHub Actions.
- Invoice content verification is not implemented.
- Five proposed scenarios (AE-20 to AE-24) remain unimplemented.
- Latest local uncommitted changes have not been verified by hosted CI.

## Evidence Interpretation

This scorecard summarizes recorded execution evidence. It does not claim that proposed scenarios, pending reviews, or unverified local changes are complete.
