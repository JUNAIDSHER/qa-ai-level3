
import * as fs from 'fs';
import * as path from 'path';

const INPUT_FILE = path.resolve('reports/test-results.json');
const OUTPUT_DIR = path.resolve('reports/rca');

interface FailureRecord {
  test: string;
  file: string;
  line: number | null;
  project: string;
  status: string;
  error: string[];
  retryCount: number;
  attachments: string[];
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
          failures.push({
            test: spec.title ?? 'Unknown test',
            file,
            line: spec.line ?? null,
            project: test.projectName ?? 'Unknown project',
            status: result.status,
            error: (result.errors ?? []).map(
              (item: any) => item.message ?? 'No error message'
            ),
            retryCount: result.retry ?? 0,
            attachments: (result.attachments ?? []).map(
              (item: any) => item.path ?? item.name ?? 'Unknown attachment'
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
    throw new Error(
      `Playwright JSON report not found: ${INPUT_FILE}`
    );
  }

  const report = JSON.parse(
    fs.readFileSync(INPUT_FILE, 'utf-8')
  );

  const failures = collectFailures(report.suites ?? []);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const summary = {
    generatedAt: new Date().toISOString(),
    commit: process.env.GITHUB_SHA ?? 'Local execution',
    totalTests: (report.stats?.expected ?? 0) + (report.stats?.unexpected ?? 0) + (report.stats?.skipped ?? 0) + (report.stats?.flaky ?? 0),
    failedTests: failures.length,
    classification: failures.length > 0
      ? 'UNKNOWN'
      : 'NO_FAILURES_RECORDED',
    confidence: failures.length > 0 ? 'LOW' : 'NOT_APPLICABLE',
    requiresHumanReview: failures.length > 0,
    failures,
    note: failures.length > 0
      ? 'Deterministic summary only. Root cause requires evidence-based human review.'
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
    `- Failed tests: ${summary.failedTests}`,
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
      `- Retry count: ${failure.retryCount}`,
      '- Errors:',
      ...(failure.error.length > 0
        ? failure.error.map((error) => `  - ${error}`)
        : ['  - No error message recorded']),
      '- Attachments:',
      ...(failure.attachments.length > 0
        ? failure.attachments.map((item) => `  - ${item}`)
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
  console.log(`Output: ${OUTPUT_DIR}`);
}

main();
