// Tests for the diagnostics aggregator ensure all required behaviours are covered.
// Each test documents its intent to satisfy the task specification.

const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('node:assert/strict');
const { test } = require('node:test');

const { aggregateDiagnostics, EXPECTED_JOBS } = require('../../.github/scripts/aggregator.js');

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function createSummary(jobKey, overrides = {}) {
  const baseSummary = {
    job: jobKey,
    status: 'success',
    exit_code: 0,
    metadata: {
      tool: 'demo-tool',
      version: '1.0.0'
    },
    environment: {
      runner: 'Hosted Agent',
      os: 'ubuntu-latest'
    },
    dependencies: {
      npm: []
    }
  };
  return { ...baseSummary, ...overrides };
}

function jobScope(jobKey) {
  if (jobKey.startsWith('frontend-checks')) return 'frontend';
  if (jobKey.startsWith('backend-checks')) return 'backend';
  return 'coverage';
}

// Nominal test: ensures aggregator parses a complete set of valid summaries.
test('aggregator parses all expected summaries without errors', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'diag-aggregator-'));
  const summariesDir = path.join(tempDir, 'summaries');
  for (const job of EXPECTED_JOBS) {
    const scope = jobScope(job);
    const filePath = path.join(summariesDir, scope, `${job}.json`);
    writeJson(filePath, createSummary(job));
  }

  const outputBase = path.join(tempDir, 'report');
  const result = aggregateDiagnostics({
    summariesDir,
    outputBase,
    schemaPath: path.resolve('diagnostics.schema.json')
  });

  assert.equal(result.totals.missingJobs, 0, 'no job should be reported missing');
  assert.equal(result.invalidFiles.length, 0, 'all summaries should be schema valid');
  assert.ok(fs.existsSync(result.reportPath), 'markdown report is generated');
});

// Edge test: guards against missing job keys by omitting one expected summary.
test('aggregator flags missing jobs when summaries are absent', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'diag-aggregator-missing-'));
  const summariesDir = path.join(tempDir, 'summaries');
  for (const job of EXPECTED_JOBS.slice(0, EXPECTED_JOBS.length - 1)) {
    const scope = jobScope(job);
    const filePath = path.join(summariesDir, scope, `${job}.json`);
    writeJson(filePath, createSummary(job));
  }

  const outputBase = path.join(tempDir, 'report');
  const result = aggregateDiagnostics({
    summariesDir,
    outputBase,
    schemaPath: path.resolve('diagnostics.schema.json')
  });

  assert.ok(result.totals.missingJobs >= 1, 'missing job should be detected');
  const missingEntry = result.records.find(record => record.job === EXPECTED_JOBS[EXPECTED_JOBS.length - 1]);
  assert.ok(missingEntry, 'placeholder record exists for missing job');
  assert.equal(missingEntry.status, 'missing');
});

// Negative test: verifies malformed JSON results in an ingestion error.
test('aggregator surfaces malformed JSON as invalid', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'diag-aggregator-malformed-'));
  const summariesDir = path.join(tempDir, 'summaries');
  const scope = jobScope(EXPECTED_JOBS[0]);
  const filePath = path.join(summariesDir, scope, `${EXPECTED_JOBS[0]}.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, '{invalid-json');

  const outputBase = path.join(tempDir, 'report');
  const result = aggregateDiagnostics({
    summariesDir,
    outputBase,
    schemaPath: path.resolve('diagnostics.schema.json')
  });

  assert.ok(result.invalidFiles.length >= 1, 'malformed JSON should be counted as invalid');
  assert.ok(result.invalidFiles.some(item => item.errors.some(err => err.includes('property name'))), 'error message should mention parse issue');
});

// Schema test: ensures missing required fields trigger schema validation errors.
test('aggregator marks summaries that violate schema', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'diag-aggregator-schema-'));
  const summariesDir = path.join(tempDir, 'summaries');
  const job = EXPECTED_JOBS[1];
  const scope = jobScope(job);
  const filePath = path.join(summariesDir, scope, `${job}.json`);
  const invalidSummary = createSummary(job, { metadata: undefined });
  writeJson(filePath, invalidSummary);

  const outputBase = path.join(tempDir, 'report');
  const result = aggregateDiagnostics({
    summariesDir,
    outputBase,
    schemaPath: path.resolve('diagnostics.schema.json')
  });

  assert.ok(result.invalidFiles.length >= 1, 'schema violation should be surfaced');
  assert.ok(result.invalidFiles.some(item => item.errors.some(err => err.includes('metadata'))));
  const record = result.records.find(entry => entry.job === job);
  assert.equal(record.schemaValid, false);
});
