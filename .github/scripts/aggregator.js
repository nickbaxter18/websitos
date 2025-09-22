#!/usr/bin/env node
"use strict";

/**
 * SECTION 1: Header & Purpose
 * This script ingests diagnostics summary JSON files, validates them against diagnostics.schema.json,
 * and writes a consolidated Markdown + JSON report consumed by downstream tooling.
 */

const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

/**
 * SECTION 2: Imports / Dependencies
 * Uses Node's fs/path modules plus Ajv and ajv-formats for runtime JSON Schema validation.
 */

const DEFAULT_SUMMARIES_DIR = path.resolve(process.cwd(), "summaries");
const DEFAULT_OUTPUT_BASENAME = path.resolve(process.cwd(), "diagnostics-report");
const DEFAULT_SCHEMA_PATH = path.resolve(process.cwd(), "diagnostics.schema.json");
const EXPECTED_SCHEMA_VERSION = "1.0.0";

/**
 * SECTION 3: Types / Schema
 * Expected summaries follow diagnostics.schema.json and represent jobs executed in ci.yml. The schema enumerates the
 * required job metadata and ensures exit_code is an integer plus structured metadata/environment blocks.
 */

const EXPECTED_JOBS = [
  "frontend-checks_lint",
  "frontend-checks_prettier",
  "frontend-checks_type-check",
  "frontend-checks_test-unit",
  "frontend-checks_playwright-e2e",
  "backend-checks_black",
  "backend-checks_flake8",
  "backend-checks_mypy",
  "backend-checks_pytest",
  "coverage-checks_frontend",
  "coverage-checks_backend",
  "coverage-checks_backend-node",
  "coverage-checks_e2e"
];

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function createValidator(schema) {
  const ajv = new Ajv({ allErrors: true, strict: false, messages: true });
  addFormats(ajv);
  return ajv.compile(schema);
}

function discoverSummaryFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const discovered = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      discovered.push(...discoverSummaryFiles(absolute));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      discovered.push(absolute);
    }
  }
  return discovered;
}

function buildOutputPaths(outputBase) {
  const resolvedBase = path.isAbsolute(outputBase)
    ? outputBase
    : path.resolve(process.cwd(), outputBase);
  const reportPath = `${resolvedBase}.md`;
  const metadataPath = `${resolvedBase}.json`;
  const parentDir = path.dirname(resolvedBase);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }
  return { reportPath, metadataPath };
}

function aggregateDiagnostics(options = {}) {
  const summariesDir = options.summariesDir || DEFAULT_SUMMARIES_DIR;
  const schemaPath = options.schemaPath || DEFAULT_SCHEMA_PATH;
  const outputBase = options.outputBase || DEFAULT_OUTPUT_BASENAME;

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema not found at ${schemaPath}`);
  }
  const schema = loadJson(schemaPath);
  const validate = createValidator(schema);

  const files = discoverSummaryFiles(summariesDir);
  const jobMap = new Map();
  const extras = [];
  const invalidFiles = [];

  for (const file of files) {
    const relative = path.relative(process.cwd(), file) || file;
    try {
      const summary = loadJson(file);
      const isValid = validate(summary);
      const errors = [];
      if (!isValid) {
        const formatted = (validate.errors || []).map(error => `${error.instancePath || "summary"} ${error.message}`.trim());
        errors.push(...formatted);
      }
      if (summary.schema_version && summary.schema_version !== EXPECTED_SCHEMA_VERSION) {
        errors.push(
          `summary/schema_version expected ${EXPECTED_SCHEMA_VERSION} but received ${summary.schema_version}`
        );
      }
      const jobKey = summary.job_key || summary.job || null;
      const entry = {
        file: relative,
        jobKey,
        status: summary.status || "unknown",
        exitCode: Number.isFinite(summary.exit_code) ? summary.exit_code : null,
        durationSeconds: typeof summary.duration_seconds === "number" ? summary.duration_seconds : null,
        startedAt: summary.started_at || null,
        completedAt: summary.completed_at || null,
        metadata: summary.metadata || {},
        environment: summary.environment || {},
        dependencies: summary.dependencies || {},
        schemaVersion: summary.schema_version || null,
        schemaValid: errors.length === 0,
        schemaErrors: errors,
        raw: summary
      };
      if (errors.length > 0) {
        invalidFiles.push({ file: relative, errors });
      }
      if (entry.jobKey && EXPECTED_JOBS.includes(entry.jobKey) && !jobMap.has(entry.jobKey)) {
        jobMap.set(entry.jobKey, entry);
      } else {
        extras.push(entry);
      }
    } catch (error) {
      invalidFiles.push({ file: relative, errors: [error.message] });
      extras.push({
        file: relative,
        jobKey: null,
        status: "failure",
        exitCode: null,
        durationSeconds: null,
        startedAt: null,
        completedAt: null,
        metadata: {},
        environment: {},
        dependencies: {},
        schemaValid: false,
        schemaErrors: [error.message]
      });
    }
  }

  const orderedEntries = EXPECTED_JOBS.map(jobKey => {
    if (jobMap.has(jobKey)) {
      return jobMap.get(jobKey);
    }
    const placeholder = {
      file: null,
      jobKey,
      status: "missing",
      exitCode: null,
      durationSeconds: null,
      startedAt: null,
      completedAt: null,
      metadata: {},
      environment: {},
      dependencies: {},
      schemaVersion: null,
      schemaValid: false,
      schemaErrors: ["summary not provided"],
      missing: true
    };
    invalidFiles.push({ file: jobKey, errors: ["summary not provided"] });
    return placeholder;
  });

  const records = [...orderedEntries, ...extras];
  const totals = {
    expectedJobs: EXPECTED_JOBS.length,
    discoveredFiles: files.length,
    validSummaries: records.filter(entry => entry.schemaValid).length,
    invalidSummaries: records.filter(entry => !entry.schemaValid).length,
    missingJobs: orderedEntries.filter(entry => entry.missing).length
  };

  const lines = [];
  lines.push("## ✅ CI Diagnostics Report");
  lines.push("");
  lines.push("| Job | Status | Exit Code | Duration (s) | Schema | Source |");
  lines.push("| --- | ------ | --------- | ------------ | ------ | ------ |");
  for (const entry of records) {
    const jobLabel = entry.jobKey || "(unmapped)";
    const status = entry.status;
    const exitCode = entry.exitCode === null ? "?" : entry.exitCode;
    const duration = typeof entry.durationSeconds === "number" ? entry.durationSeconds : "?";
    const schemaIcon = entry.schemaValid ? "✅" : "❌";
    const source = entry.file || "(missing)";
    lines.push(`| ${jobLabel} | ${status} | ${exitCode} | ${duration} | ${schemaIcon} | ${source} |`);
  }

  lines.push("");
  lines.push("### 🛠 Tool Metadata");
  lines.push("");
  lines.push("| Job | Tool | Version | Node | Runner | OS |");
  lines.push("| --- | ---- | ------- | ---- | ------ | -- |");
  for (const entry of records) {
    const tool = entry.metadata?.tool || "?";
    const version = entry.metadata?.version || "?";
    const nodeVersion = entry.environment?.node_version || "?";
    const runner = entry.environment?.runner || "?";
    const os = entry.environment?.os || "?";
    lines.push(`| ${entry.jobKey || "(unmapped)"} | ${tool} | ${version} | ${nodeVersion} | ${runner} | ${os} |`);
  }

  const invalidSection = invalidFiles.length
    ? invalidFiles
        .map(item => `- ${item.file}: ${item.errors.join(", ")}`)
        .join("\n")
    : "_No schema violations detected._";
  lines.push("");
  lines.push("### ⚠️ Schema & Ingestion Issues");
  lines.push("");
  lines.push(invalidSection);

  lines.push("");
  lines.push("### 🚀 Future Improvement Hooks");
  lines.push("");
  lines.push("- Stream summaries using fs.readdir with async generators to scale to thousands of jobs.");
  lines.push("- Introduce TypeScript definitions and validation for diagnostics summaries for additional type safety.");
  lines.push("- Auto-post diagnostics summaries to pull requests for instant visibility.");

  const report = lines.join("\n");
  const { reportPath, metadataPath } = buildOutputPaths(outputBase);
  fs.writeFileSync(reportPath, report, "utf-8");
  fs.writeFileSync(
    metadataPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        schemaVersion: EXPECTED_SCHEMA_VERSION,
        totals,
        records: records.map(entry => ({
          job_key: entry.jobKey,
          status: entry.status,
          exit_code: entry.exitCode,
          duration_seconds: entry.durationSeconds,
          schema_valid: entry.schemaValid,
          schema_version: entry.schemaVersion,
          file: entry.file || null,
          started_at: entry.startedAt,
          completed_at: entry.completedAt
        }))
      },
      null,
      2
    ),
    "utf-8"
  );

  return {
    reportPath,
    metadataPath,
    totals,
    records,
    invalidFiles
  };
}

function parseCliArgs(argv) {
  const args = { summariesDir: DEFAULT_SUMMARIES_DIR, outputBase: DEFAULT_OUTPUT_BASENAME, schemaPath: DEFAULT_SCHEMA_PATH };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--summaries" && argv[index + 1]) {
      args.summariesDir = path.resolve(process.cwd(), argv[index + 1]);
      index += 1;
    } else if (arg === "--output" && argv[index + 1]) {
      const outputArg = argv[index + 1];
      index += 1;
      args.outputBase = outputArg.endsWith(".md") || outputArg.endsWith(".json")
        ? outputArg.replace(/\.(md|json)$/i, "")
        : outputArg;
      args.outputBase = path.isAbsolute(args.outputBase)
        ? args.outputBase
        : path.resolve(process.cwd(), args.outputBase);
    } else if (arg === "--schema" && argv[index + 1]) {
      args.schemaPath = path.resolve(process.cwd(), argv[index + 1]);
      index += 1;
    }
  }
  return args;
}

/**
 * SECTION 4: Core Logic
 * aggregateDiagnostics() coordinates discovery, validation, ordering, markdown generation, and metadata emission.
 */

if (require.main === module) {
  try {
    const options = parseCliArgs(process.argv.slice(2));
    const result = aggregateDiagnostics(options);
    console.log(`Diagnostics report written to ${result.reportPath}`);
    console.log(`Diagnostics metadata written to ${result.metadataPath}`);
    if (result.invalidFiles.length > 0) {
      console.warn("Schema or ingestion issues detected:");
      for (const issue of result.invalidFiles) {
        console.warn(` - ${issue.file}: ${issue.errors.join(", ")}`);
      }
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(`Diagnostics aggregation failed: ${error.message}`);
    process.exitCode = 1;
  }
}

/**
 * SECTION 5: Error & Edge Case Handling
 * - Missing schema file raises an explicit error.
 * - Invalid JSON is captured with file context and bubbled into the report.
 * - Missing job summaries are surfaced as schema-invalid placeholders with clear messaging.
 */

/**
 * SECTION 6: Performance Considerations
 * All filesystem reads are synchronous for simplicity with a small number of files, resulting in O(n) behaviour where n is the
 * number of summary files. The footprint is small enough to execute in milliseconds on CI runners.
 */

/**
 * SECTION 7: Exports
 * Exposes aggregateDiagnostics and EXPECTED_JOBS for unit tests and downstream tooling.
 */

module.exports = {
  aggregateDiagnostics,
  EXPECTED_JOBS,
  EXPECTED_SCHEMA_VERSION
};
