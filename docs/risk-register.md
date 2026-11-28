# Project Risk Register

**Project:** AI Level-3 Quality Engineering – Playwright + Agentic RCA  
**Last updated:** 28 November 2026

## 1. Risk Scoring Method

Likelihood and Impact are each scored from 1 to 5.

Risk Score = Likelihood × Impact

| Score | Priority |
|---|---|
| 1–4 | Low |
| 5–9 | Medium |
| 10–15 | High |
| 16–25 | Critical |

## 2. Identified Risks

| Risk ID | Risk | Likelihood | Impact | Score | Priority | Mitigation / Response |
|---|---|---:|---:|---:|---|---|
| R-01 | Cloudflare anti-bot challenge blocks automated browser or API requests | 4 | 4 | 16 | Critical | Detect challenge pages, preserve evidence, classify as external dependency failure, and avoid bypassing anti-bot controls |
| R-02 | Target application or external API becomes unavailable | 3 | 4 | 12 | High | Capture response details, traces and screenshots; distinguish service outages from application defects |
| R-03 | UI locator changes cause test failures | 3 | 4 | 12 | High | Use stable locators, maintain Page Object Model, preserve failure evidence and review locator repair proposals |
| R-04 | Timing or state instability causes flaky UI tests | 3 | 3 | 9 | Medium | Use explicit waits, isolated test data, controlled execution and repeated smoke runs |
| R-05 | Gemini API becomes unavailable or rejects credentials | 3 | 3 | 9 | Medium | Use deterministic RCA fallback, record analysis mode and preserve input evidence |
| R-06 | AI-generated RCA incorrectly identifies root cause | 3 | 5 | 15 | High | Require human review, validate against traces and logs, and prohibit automatic code repair |
| R-07 | Secrets or personal information appear in RCA artifacts | 2 | 5 | 10 | High | Sanitize RCA inputs, keep `.env` out of version control, restrict artifact access and review generated reports |
| R-08 | RCA summary files may be overwritten, causing loss of historical incident context | 3 | 4 | 12 | High | Preserve timestamped incident-specific reports, document summary overwrite behavior, retain failure evidence and upload artifacts even when tests fail |
| R-09 | FI-01 fault is not repeatable through a dedicated current test | 3 | 3 | 9 | Medium | Add a dedicated opt-in FI-01 test if required; retain historical report and repair evidence |
| R-10 | FI-02 fault injection is skipped during normal test execution | 3 | 3 | 9 | Medium | Run it explicitly in a controlled fault-injection job and preserve expected-failure evidence |
| R-11 | GitHub-hosted CI behavior differs from local execution | 3 | 4 | 12 | High | Verify actual hosted runs, inspect artifacts, and document environment-specific failures |
| R-12 | Test accounts or shared application state interfere with parallel execution | 3 | 3 | 9 | Medium | Use unique test data, clean up created accounts and keep workers controlled where needed |
| R-13 | Documentation claims exceed available test evidence | 3 | 4 | 12 | High | Keep traceability links current, reconcile counts with reports and mark unverified requirements explicitly |

## 3. Critical and High-Priority Risk Response

### R-01: Anti-bot challenge

- **Trigger:** A challenge page or Cloudflare verification response appears.
- **Detection:** API response helper detects known challenge markers.
- **Response:** Classify as an external dependency failure and preserve diagnostic evidence.
- **Restriction:** Do not bypass anti-bot protection.

### R-06: Incorrect AI root-cause analysis

- **Trigger:** AI-generated explanation conflicts with test evidence or application behavior.
- **Response:** Compare the proposed root cause with trace, screenshot, error context and logs.
- **Approval:** A human reviewer must approve any proposed repair.
- **Restriction:** AI analysis must not automatically modify project source files.

### R-11: Hosted CI failure

- **Trigger:** GitHub Actions result differs from local test results.
- **Response:** Inspect runner environment, dependency installation, browser setup and uploaded artifacts.
- **Current status:** Hosted CI success is not verified in the available evidence.

## 4. Risk Monitoring

| Monitoring Area | Evidence / Method | Review Frequency |
|---|---|---|
| External dependency failures | API helper markers and test logs | Every test run |
| UI stability | Playwright failures, traces and smoke logs | Every test run |
| RCA quality | Human review of RCA summaries | Every RCA incident |
| Secret exposure | `.gitignore`, sanitization and artifact review | Every release / submission |
| CI reliability | GitHub Actions run and artifacts | Every workflow run |
| Coverage gaps | Traceability matrix | Every test change |

## 5. Current Risk Acceptance and Limitations

- Cloudflare challenge remains an external dependency and must not be treated as a confirmed application defect.
- FI-01 has historical evidence but no dedicated repeatable test currently exists.
- FI-02 is opt-in and is not part of the normal full-suite execution.
- Gemini fallback has been verified for FI-02; FI-01 fallback still requires separate verification.
- Hosted GitHub Actions success has not been established from the available evidence.
- Risk scores are initial qualitative estimates and should be reviewed using actual incident frequency and impact.

## 6. Review and Ownership

**Review owner:** Project QA / human reviewer  
**Review trigger:** New test failures, application changes, CI failures, RCA incidents or changes in project scope.

All AI-generated RCA repair proposals require human approval before implementation.

