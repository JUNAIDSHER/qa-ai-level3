
import * as fs from 'fs';
import * as path from 'path';

const INPUT_FILE = path.resolve('reports/test-results.json');
const OUTPUT_DIR = path.resolve('reports/rca');

type FailureClassification =
  | 'EXTERNAL_DEPENDENCY_FAILURE'
  | 'UNKNOWN';

interface FailureRecord {
  test: string;
  file: string;
  line: number | null;
  project: string;
  status: string;
  classification: FailureClassification;
  error: string[];
  retryIndex: number;
  stack?: string;
  testId?: string;
  runUrl?: string;
  commitSha?: string;
  attachments: string[];
}

function classifyFailure(errors: string[]): FailureClassification {
  const combinedError = errors.join('\n');

  if (
    /EXTERNAL_DEPENDENCY_FAILURE|One moment, please|Please wait while your request is being verified|cf-chl/i.test(
      combinedError
    )
  ) {
    return 'EXTERNAL_DEPENDENCY_FAILURE';
  }

  return 'UNKNOWN';
}

function sanitizeText(value: string): string {
  return value
    .replace(
      /("(?:password|passwd|token|api[_-]?key|authorization|secret)"\s*:\s*")[^"]*(")/gi,
      '$1[REDACTED]$2'
    )
    .replace(
      /\b(password|passwd|token|api[_-]?key|authorization|secret)\s*[:=]\s*[^\s,;]+/gi,
      '$1=[REDACTED]'
    )
    .replace(/\bAIza[0-9A-Za-z_-]{20,}\b/g, '[REDACTED_API_KEY]')
    .replace(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      '[REDACTED_EMAIL]'
    );
}

function collectFailures(
  suites: any[],
  failures: FailureRecord[] = []
): FailureRecord[] {
  for (const suite of suites ?? []) {
    const file = suite.file ?? '';

    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        const results = test.results ?? [];

        const failedResults = results.filter(
          (result: any) =>
            result.status === 'failed' ||
            result.status === 'timedOut' ||
            result.status === 'interrupted'
        );

        for (const result of failedResults) {
          const rawErrors = (result.errors ?? []).map(
            (item: any) => item.message ?? 'No error message'
          );

          // Classify using original error text before sanitization.
          const classification = classifyFailure(rawErrors);

          // Store sanitized error messages only.
          const errors = rawErrors.map(
            (error: string) => sanitizeText(error)
          );

          failures.push({
            test: spec.title ?? 'Unknown test',
            file,
            line: spec.line ?? null,
            project: test.projectName ?? 'Unknown project',
            status: result.status,
            classification,
            error: errors,
            retryIndex: result.retry ?? 0,
            stack: sanitizeText(
              (result.errors ?? [])
                .map((item: any) => item.stack ?? '')
                .filter(Boolean)
                .join('\n')
            ),
            testId: spec.id ?? undefined,
            runUrl:
              process.env.GITHUB_SERVER_URL &&
              process.env.GITHUB_REPOSITORY &&
              process.env.GITHUB_RUN_ID
                ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
                : undefined,
            commitSha: process.env.GITHUB_SHA ?? undefined,
            attachments: (result.attachments ?? []).map(
              (item: any) =>
                sanitizeText(
                  item.name ??
                  path.basename(item.path ?? 'Unknown attachment')
                )
            ),
          });
        }
      }
    }

    collectFailures(suite.suites ?? [], failures);
  }

  return failures;
}

function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    throw new Error(`Playwright JSON report not found: ${INPUT_FILE}`);
  }

  const report = JSON.parse(
    fs.readFileSync(INPUT_FILE, 'utf-8')
  );

  const failures = collectFailures(report.suites ?? []);

  // Count unique failed tests instead of individual failed retry attempts.
  const failedTestKeys = new Set(
    failures.map(
      failure =>
        `${failure.file}::${failure.test}::${failure.project}`
    )
  );

  const externalFailureTestKeys = new Set(
    failures
      .filter(
        failure =>
          failure.classification === 'EXTERNAL_DEPENDENCY_FAILURE'
      )
      .map(
        failure =>
          `${failure.file}::${failure.test}::${failure.project}`
      )
  );

  const externalFailures = failures.filter(
    failure =>
      failure.classification === 'EXTERNAL_DEPENDENCY_FAILURE'
  );

  let classification = 'NO_FAILURES_RECORDED';

  if (failures.length > 0) {
    if (externalFailures.length === failures.length) {
      classification = 'EXTERNAL_DEPENDENCY_FAILURE';
    } else if (externalFailures.length > 0) {
      classification = 'MIXED';
    } else {
      classification = 'UNKNOWN';
    }
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const summary = {
    generatedAt: new Date().toISOString(),
    commit: process.env.GITHUB_SHA ?? 'Local execution',
    totalTests:
      (report.stats?.expected ?? 0) +
      (report.stats?.unexpected ?? 0) +
      (report.stats?.skipped ?? 0) +
      (report.stats?.flaky ?? 0),
    failedTests: failedTestKeys.size,
    externalDependencyFailures: externalFailureTestKeys.size,
    classification,
    confidence:
      classification === 'EXTERNAL_DEPENDENCY_FAILURE'
        ? 'MEDIUM'
        : failures.length > 0
          ? 'LOW'
          : 'NOT_APPLICABLE',
    requiresHumanReview: failures.length > 0,
    failures,
    note:
      failures.length > 0
        ? 'Deterministic classification based on recorded error markers. Human review is required to confirm root cause.'
        : 'No failed test results were recorded in the JSON report.',
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'deterministic-summary.json'),
    JSON.stringify(summary, null, 2)
  );

  const markdown = [
    '# Deterministic RCA Summary',
    '',
    `- Generated: ${summary.generatedAt}`,
    `- Commit: ${summary.commit}`,
    `- Total tests: ${summary.totalTests}`,
    `- Failed tests: ${summary.failedTests}`,
    `- External dependency failures: ${summary.externalDependencyFailures}`,
    `- Classification: ${summary.classification}`,
    `- Confidence: ${summary.confidence}`,
    `- Human review required: ${summary.requiresHumanReview}`,
    '',
    '## Failure details',
    '',
    ...failures.flatMap((failure, index) => [
      `### Failure ${index + 1}: ${failure.test}`,
      `- File: ${failure.file}`,
      `- Line: ${failure.line ?? 'Unknown'}`,
      `- Project: ${failure.project}`,
      `- Status: ${failure.status}`,
      `- Classification: ${failure.classification}`,
      `- Retry index: ${failure.retryIndex}`,
      `- Test ID: ${failure.testId ?? 'Not provided'}`,
      `- Run URL: ${failure.runUrl ?? 'Not provided'}`,
      `- Commit SHA: ${failure.commitSha ?? 'Not provided'}`,
      '- Stack trace:',
      ...(failure.stack
        ? failure.stack.split('\n').map(line => `  ${line}`)
        : ['  Not provided']),
      '- Errors:',
      ...(failure.error.length > 0
        ? failure.error.map(error => `  - ${error}`)
        : ['  - No error message recorded']),
      '- Attachments:',
      ...(failure.attachments.length > 0
        ? failure.attachments.map(item => `  - ${item}`)
        : ['  - None recorded']),
      '',
    ]),
    '',
    summary.note,
  ].join('\n');

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'deterministic-summary.md'),
    markdown
  );

  console.log('Deterministic RCA summary generated.');
  console.log(`Failed tests: ${summary.failedTests}`);
  console.log(
    `External dependency failures: ${summary.externalDependencyFailures}`
  );
  console.log(`Classification: ${summary.classification}`);
  console.log(`Human review required: ${summary.requiresHumanReview}`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main();
