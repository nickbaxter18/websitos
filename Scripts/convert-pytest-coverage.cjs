#!/usr/bin/env node

const fs = require("fs");
const crypto = require("crypto");

const inputFile = process.argv[2];
const outputFile = process.argv[3];
const exitCodeFile = process.argv[4] || null;

const workflow = "coverage-checks";
const job = "backend-coverage";

function fallback(errMsg) {
  const report = {
    workflow,
    job,
    status: "failure",
    errors: [{ message: errMsg }],
    warnings: [],
    notices: []
  };
  fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
  console.error(`❌ ${errMsg}`);
}

try {
  if (!fs.existsSync(inputFile) || fs.statSync(inputFile).size === 0) {
    return fallback(`Coverage summary missing or empty: ${inputFile}`);
  }

  const raw = fs.readFileSync(inputFile, "utf-8");
  const data = JSON.parse(raw);

  const report = {
    workflow,
    job,
    status: "success",
    errors: [],
    warnings: [],
    notices: []
  };

  if (data.total) {
    const { lines, branches, functions, statements } = data.total;
    if (lines.pct < 70 || branches.pct < 70 || functions.pct < 70 || statements.pct < 70) {
      report.status = "failure";
      report.warnings.push({
        file: inputFile,
        message: `Coverage below threshold. Lines: ${lines.pct}%, Branches: ${branches.pct}%, Functions: ${functions.pct}%, Statements: ${statements.pct}%`,
        rule: "coverage-threshold",
        severity: "warning"
      });
    }
    report.notices.push({
      message: `Coverage summary: lines=${lines.pct}%, branches=${branches.pct}%, functions=${functions.pct}%, statements=${statements.pct}%`
    });
  } else {
    report.status = "failure";
    report.errors.push({
      file: inputFile,
      message: "Coverage summary missing 'total' field",
      rule: "coverage",
      severity: "error"
    });
  }

  // Add metadata
  const size = fs.statSync(inputFile).size;
  const checksum = crypto.createHash("sha256").update(raw).digest("hex");
  report.notices.push({ message: `Input size: ${size} bytes` });
  report.notices.push({ message: `sha256: ${checksum}` });

  if (exitCodeFile && fs.existsSync(exitCodeFile)) {
    const code = fs.readFileSync(exitCodeFile, "utf-8").trim();
    report.notices.push({ message: `Pytest coverage exit code: ${code}` });
  }

  report.notices.push({ message: `Timestamp: ${new Date().toISOString()}` });

  fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
  console.log(`✅ Pytest coverage summary written to ${outputFile}`);
} catch (e) {
  fallback(`Pytest coverage converter crashed: ${e.message}`);
}