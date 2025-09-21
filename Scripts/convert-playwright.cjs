#!/usr/bin/env node
const fs = require("fs");

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error("Usage: convert-playwright.cjs <playwright-output> <coverage-summary> <report-output> [exit-code]");
  process.exit(1);
}

const [playwrightOutput, coverageSummary, reportOutput, exitCodeFile] = args;

function safeRead(file, fallback) {
  try {
    return fs.readFileSync(file, "utf-8");
  } catch (e) {
    return fallback;
  }
}

function safeJSON(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch (e) {
    return fallback;
  }
}

const exitCode = exitCodeFile ? parseInt(safeRead(exitCodeFile, "1").trim(), 10) : 1;
const output = safeRead(playwrightOutput, "");
const coverage = safeJSON(coverageSummary, {});

let status = "success";
if (exitCode !== 0) status = "failure";

const report = {
  workflow: "frontend-checks",
  job: "playwright-e2e",
  status,
  errors: [],
  warnings: [],
  notices: []
};

if (exitCode !== 0) {
  report.errors.push({ message: "Playwright tests failed" });
}

if (!coverage || Object.keys(coverage).length === 0) {
  report.warnings.push({ message: "No coverage data found" });
}

// Save raw snippets for debugging
if (output) {
  report.notices.push({ message: `Playwright raw output captured (${output.length} chars)` });
}

// Always ensure report file exists
try {
  fs.writeFileSync(reportOutput, JSON.stringify(report, null, 2));
  console.log(`✅ Playwright report written: ${reportOutput}`);
} catch (e) {
  console.error(`Failed to write playwright report: ${e.message}`);
  process.exit(0); // do not break pipeline
}