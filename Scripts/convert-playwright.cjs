#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

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

try {
  const exitCode = exitCodeFile && fs.existsSync(exitCodeFile)
    ? fs.readFileSync(exitCodeFile, "utf-8").trim()
    : "?";
  const output = safeRead(playwrightOutput, "");
  const coverage = safeJSON(coverageSummary, {});

  let status = "success";
  if (exitCode !== "0") status = "failure";

  const report = {
    workflow: "frontend-checks",
    job: "playwright-e2e",
    status,
    errors: [],
    warnings: [],
    notices: []
  };

  if (exitCode !== "0") {
    report.errors.push({ message: "Playwright tests failed" });
  }

  if (!coverage || Object.keys(coverage).length === 0) {
    report.warnings.push({ message: "No coverage data found" });
  }

  if (output) {
    const sha = crypto.createHash("sha256").update(output).digest("hex");
    report.notices.push({ message: `Playwright raw output captured (${output.length} chars)` });
    report.notices.push({ message: `sha256: ${sha}` });
  }

  report.notices.push({ message: `Timestamp: ${new Date().toISOString()}` });

  fs.writeFileSync(reportOutput, JSON.stringify(report, null, 2));
  console.log(`✅ Playwright report written: ${reportOutput}`);
} catch (e) {
  const fallback = {
    workflow: "frontend-checks",
    job: "playwright-e2e",
    status: "failure",
    errors: [{ message: `Playwright converter crashed: ${e.message}` }],
    warnings: [],
    notices: []
  };
  fs.writeFileSync(reportOutput, JSON.stringify(fallback, null, 2));
  console.error(`❌ Playwright converter crashed: ${e.message}`);
  process.exit(0);
}