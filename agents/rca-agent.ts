
import * as fs from 'fs';
import * as path from 'path';

const RCA_SKILL_PATH = path.resolve('skills/rca-analysis.md');

interface RCAReport {
  incident: string;
  failureType: string;
  rootCause: string;
  evidence: string[];
  repairProposal: string;
  humanApprovalRequired: boolean;
}

async function analyzeFailure(
  errorLog: string,
  skillInstructions: string
): Promise<RCAReport> {

  // Load Gemini client dynamically because this file uses CommonJS.
  const { gemini } = await import('./gemini-client.mjs');

  const prompt = `
You are an expert Playwright QA Root Cause Analysis agent.

Follow these RCA skill instructions:
${skillInstructions}

Analyze the following Playwright failure log:

${errorLog}

Return ONLY valid JSON with these exact fields:
{
  "incident": "Short incident summary",
  "failureType": "Failure classification",
  "rootCause": "Evidence-based root cause",
  "evidence": ["Evidence item 1", "Evidence item 2"],
  "repairProposal": "Smallest safe proposed repair",
  "humanApprovalRequired": true
}

Important rules:
- Do not invent evidence.
- Separate confirmed facts from assumptions.
- Never claim a test passed if it failed.
- Never automatically modify source code.
- Always require human approval.
- Return valid JSON only.
`;

  const response = await gemini.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt
  });

  const resultText = response.text;

  if (!resultText) {
    throw new Error('Gemini returned an empty response.');
  }

  const cleanedText = resultText
    .replace(/^```json\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  const report = JSON.parse(cleanedText) as RCAReport;

  // Human approval must always remain mandatory.
  report.humanApprovalRequired = true;

  return report;
}

async function main() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    console.error(
      'Usage: npx tsx agents/rca-agent.ts <error-log-file>'
    );
    process.exitCode = 1;
    return;
  }

  const absolutePath = path.resolve(inputPath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`Error log not found: ${absolutePath}`);
    process.exitCode = 1;
    return;
  }

  if (!fs.existsSync(RCA_SKILL_PATH)) {
    throw new Error('RCA analysis skill file not found.');
  }

  const errorLog = fs.readFileSync(absolutePath, 'utf-8');

  const skillInstructions = fs.readFileSync(
    RCA_SKILL_PATH,
    'utf-8'
  );

  console.log('RCA Skill loaded.');
  console.log('Sending failure evidence to Gemini AI...');

  const report = await analyzeFailure(
    errorLog,
    skillInstructions
  );

  console.log('\n===== Gemini AI-Assisted RCA Report =====\n');
  console.log(JSON.stringify(report, null, 2));

  console.log('\nHuman approval is required before any repair.');
}

main().catch((error) => {
  console.error('RCA Agent failed:', error.message);
  process.exitCode = 1;
});
