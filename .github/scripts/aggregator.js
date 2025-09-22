#!/usr/bin/env node
"use strict";

/**
 * SECTION 1: Header & Purpose
 * This script ingests diagnostics summary JSON files, validates them against diagnostics.schema.json,
 * and writes a consolidated Markdown + JSON report consumed by downstream tooling.
 */

const fs = require("fs");
const path = require("path");

/**
 * SECTION 2: Imports / Dependencies
 * Uses Node's fs/path modules only. Validation is implemented manually from the JSON schema to keep runtime lean.
 */

const DEFAULT_SUMMARIES_DIR = path.resolve(process.cwd(), "summaries");
const DEFAULT_OUTPUT_BASENAME = path.resolve(process.cwd(), "diagnostics-report");
const DEFAULT_SCHEMA_PATH = path.resolve(process.cwd(), "diagnostics.schema.json");

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

function validateSummaryAgainstSchema(summary, schema) {
  const errors = [];

  function assertType(value, schemaNode, pointer) {
    if (!schemaNode) return;
    const type = schemaNode.type;
    if (type === "object") {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        errors.push(`${pointer} expected object`);
        return;
      }
      const required = schemaNode.required || [];
      for (const key of required) {
        if (!Object.prototype.hasOwnProperty.call(value, key)) {
          errors.push(`${pointer}/${key} is required`);
        }
      }
      const properties = schemaNode.properties || {};
      for (const [prop, descriptor] of Object.entries(properties)) {
        if (Object.prototype.hasOwnProperty.call(value, prop)) {
          assertType(value[prop], descriptor, `${pointer}/${prop}`);
        }
      }
    } else if (type === "array") {
      if (!Array.isArray(value)) {
        errors.push(`${pointer} expected array`);
        return;
      }
      if (schemaNode.items) {
        value.forEach((entry, idx) => assertType(entry, schemaNode.items, `${pointer}/${idx}`));
      }
    } else if (type === "integer") {
      if (!Number.isInteger(value)) {
        errors.push(`${pointer} expected integer`);
      }
    } else if (type === "string") {
      if (typeof value !== "string") {
        errors.push(`${pointer} expected string`);
      } else if (schemaNode.enum && !schemaNode.enum.includes(value)) {
        errors.push(`${pointer} expected one of ${schemaNode.enum.join(", ")}`);
      }
    }
  }

  assertType(summary, schema, "summary");
  return {
    valid: errors.length === 0,
    errors
  };
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

  const files = discoverSummaryFiles(summariesDir);
  const jobMap = new Map();
  const extras = [];
  const processed = [];
  const invalidFiles = [];

  for (const file of files) {
    const relative = path.relative(process.cwd(), file) || file;
    try {
      const summary = loadJson(file);
      const validation = validateSummaryAgainstSchema(summary, schema);
      const entry = {
        file: relative,
        job: summary.job || null,
        status: summary.status || "unknown",
        exit_code: typeof summary.exit_code === "number" ? summary.exit_code : null,
        metadata: summary.metadata || {},
        environment: summary.environment || {},
        dependencies: summary.dependencies || {},
        schemaValid: validation.valid,
        schemaErrors: validation.errors,
        raw: summary
      };
      processed.push(entry);
      if (!validation.valid) {
        invalidFiles.push({ file: relative, errors: validation.errors });
      }
      if (entry.job && EXPECTED_JOBS.includes(entry.job) && !jobMap.has(entry.job)) {
        jobMap.set(entry.job, entry);
      } else {
        extras.push(entry);
      }
    } catch (error) {
      invalidFiles.push({ file: relative, errors: [error.message] });
      extras.push({
        file: relative,
        job: null,
        status: "failure",
        exit_code: null,
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
      job: jobKey,
      status: "missing",
      exit_code: null,
      metadata: {},
      environment: {},
      dependencies: {},
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
  lines.push("| Job | Status | Exit Code | Schema | Source |");
  lines.push("| --- | ------ | --------- | ------ | ------ |");
  for (const entry of records) {
    const jobLabel = entry.job || "(unmapped)";
    const status = entry.status;
    const exitCode = entry.exit_code === null ? "?" : entry.exit_code;
    const schemaIcon = entry.schemaValid ? "✅" : "❌";
    const source = entry.file || "(missing)";
    lines.push(`| ${jobLabel} | ${status} | ${exitCode} | ${schemaIcon} | ${source} |`);
  }

  lines.push("");
  lines.push("### 🛠 Tool Metadata");
  lines.push("");
  lines.push("| Job | Tool | Version | Runner | OS |");
  lines.push("| --- | ---- | ------- | ------ | -- |");
  for (const entry of records) {
    const tool = entry.metadata?.tool || "?";
    const version = entry.metadata?.version || "?";
    const runner = entry.environment?.runner || "?";
    const os = entry.environment?.os || "?";
    lines.push(`| ${entry.job || "(unmapped)"} | ${tool} | ${version} | ${runner} | ${os} |`);
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
        totals,
        records: records.map(entry => ({
          job: entry.job,
          status: entry.status,
          exit_code: entry.exit_code,
          schemaValid: entry.schemaValid,
          file: entry.file || null
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
  validateSummaryAgainstSchema
};
