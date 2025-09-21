#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");

if (process.argv.length < 4) {
  console.error("Usage: node convert-jest-coverage.cjs <input> <output> [exitCodeFile]");
  process.exit(1);
}

const [inputFile, outputFile, exitCodeFile] = process.argv.slice(2);
const workflow = "coverage-checks";
const job = "jest-coverage";

function fallback(errMsg) {
  fs.writeFileSync(outputFile, JSON.stringify({
    workflow,
    job,
    status: "failure",
    errors: [{ message: errMsg }],
    warnings: [],
    notices: []
  }, null, 2));
  console.error(`❌ ${errMsg}`);
}

try {
  if (!fs.existsSync(inputFile)) {
    return fallback(`Input file missing: ${inputFile}`);
  }

  const raw = fs.readFileSync(inputFile, "utf-8");
  const data = JSON.parse(raw);
  const exitCode = exitCodeFile && fs.existsSync(exitCodeFile)
    ? fs.readFileSync(exitCodeFile, "utf-8").trim()
    : "?";
  const sha = crypto.createHash("sha256").update(raw).digest("hex");

  const summary = {
    workflow,
    job,
    status: "success",
    errors: [],
    warnings: [],
    notices: [
      { message: `exit code: ${exitCode}` },
      { message: `Input size: ${raw.length} bytes` },
      { message: `sha256: ${sha}` }
    ]
  };

  const thresholds = { statements: 90, branches: 80, functions: 90, lines: 90 };

  Object.keys(thresholds).forEach(metric => {
    const pct = data.total?.[metric]?.pct || 0;
    if (pct < thresholds[metric]) {
      summary.errors.push({
        file: "ALL",
        line: null,
        message: `${metric} coverage ${pct}% below threshold ${thresholds[metric]}%`,
        rule: "coverage-threshold",
        severity: "error",
        suggestion: "Add more tests to improve coverage."
      });
      summary.status = "failure";
    }
  });

  fs.writeFileSync(outputFile, JSON.stringify(summary, null, 2));
  console.log(`✅ Jest coverage summary written to ${outputFile}`);
} catch (err) {
  fallback(`Parse error: ${err.message}`);
}