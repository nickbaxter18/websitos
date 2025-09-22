// Tests for the diagnostics aggregator ensure all required behaviours are covered.
// Each test documents its intent to satisfy the task specification.

const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('node:assert/strict');
const { test } = require('node:test');

const {
  aggregateDiagnostics,
  EXPECTED_JOBS,
  EXPECTED_SCHEMA_VERSION
} = require('../../.github/scripts/aggregator.js');

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function createSummary(jobKey, overrides = {}) {
  const baseSummary = {
    schema_version: EXPECTED_SCHEMA_VERSION,
    job_key: jobKey,
    status: 'success',
    exit_code: 0,
    started_at: '2024-01-01T00:00:00Z',
    completed_at: '2024-01-01T00:00:30Z',
    duration_seconds: 30,
    metadata: {
      tool: 'demo-tool',
      version: '1.0.0',
      logs_size_bytes: 128,
      retry_count: 0,
      warnings_count: 0
    },
    environment: {
      os: 'ubuntu-latest',
      node_version: 'v20.0.0',
      runner: 'Hosted Agent'
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
  const missingEntry = result.records.find(record => record.jobKey === EXPECTED_JOBS[EXPECTED_JOBS.length - 1]);
  assert.ok(missingEntry, 'placeholder record exists for missing job');
  assert.equal(missingEntry.status, 'missing');
});

// Negative test: verifies malformed JSON results in an ingestion error.
test('aggregator surfaces malformed JSON as invalid', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'diag-aggregator-malformed-'));
  const summariesDir = path.join(tempDir, 'summaries');
  const firstJob = EXPECTED_JOBS[0];
  const scope = jobScope(firstJob);
  const filePath = path.join(summariesDir, scope, `${firstJob}.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, '{invalid-json');

  const outputBase = path.join(tempDir, 'report');
  const result = aggregateDiagnostics({
    summariesDir,
    outputBase,
    schemaPath: path.resolve('diagnostics.schema.json')
  });

  assert.ok(result.invalidFiles.length >= 1, 'malformed JSON should be counted as invalid');
  assert.ok(result.invalidFiles.some(item => item.errors.some(err => err.includes('Unexpected token') || err.includes('JSON'))), 'error message should mention parse issue');
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
  const record = result.records.find(entry => entry.jobKey === job);
  assert.equal(record.schemaValid, false);
});

// Version test: ensures schema version mismatches are detected and surfaced.
test('aggregator flags schema version mismatches', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'diag-aggregator-version-'));
  const summariesDir = path.join(tempDir, 'summaries');
  const job = EXPECTED_JOBS[2];
  const scope = jobScope(job);
  const filePath = path.join(summariesDir, scope, `${job}.json`);
  const badSummary = createSummary(job, { schema_version: '2.0.0' });
  writeJson(filePath, badSummary);

  const outputBase = path.join(tempDir, 'report');
  const result = aggregateDiagnostics({
    summariesDir,
    outputBase,
    schemaPath: path.resolve('diagnostics.schema.json')
  });

  assert.ok(result.invalidFiles.some(item => item.errors.some(err => err.includes('schema_version'))));
});

// Performance guard: aggregator should comfortably handle large sets of extra summaries.
test('aggregator handles large numbers of extra summary files', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'diag-aggregator-scale-'));
  const summariesDir = path.join(tempDir, 'summaries');
  for (const job of EXPECTED_JOBS) {
    const scope = jobScope(job);
    const filePath = path.join(summariesDir, scope, `${job}.json`);
    writeJson(filePath, createSummary(job));
  }

  // Introduce 200 extra summaries to simulate scale.
  for (let index = 0; index < 200; index += 1) {
    const filePath = path.join(summariesDir, 'extras', `extra-${index}.json`);
    writeJson(filePath, createSummary(`extra-${index}`, { job_key: `extra-${index}` }));
  }

  const outputBase = path.join(tempDir, 'report');
  const result = aggregateDiagnostics({
    summariesDir,
    outputBase,
    schemaPath: path.resolve('diagnostics.schema.json')
  });

  assert.equal(result.totals.missingJobs, 0, 'no expected job should be missing');
  assert.equal(result.invalidFiles.length, 0, 'extra valid summaries should not be flagged invalid');
});
