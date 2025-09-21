#!/usr/bin/env node

const fs = require("fs");
const crypto = require("crypto");

const inputFile = process.argv[2];
const outputFile = process.argv[3];
const exitCodeFile = process.argv[4] || null;

let report = {
  workflow: "coverage-checks",
  job: "backend-coverage",
  status: "success",
  errors: [],
  warnings: [],
  notices: []
};

try {
  if (!fs.existsSync(inputFile) || fs.statSync(inputFile).size === 0) {
    report.status = "failure";
    report.errors.push({
      file: inputFile || "?",
      message: "Coverage summary missing or empty",
      rule: "coverage",
      severity: "error"
    });
  } else {
    const raw = fs.readFileSync(inputFile, "utf-8");
    const data = JSON.parse(raw);

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
  }

  // Add metadata
  if (fs.existsSync(inputFile)) {
    const size = fs.statSync(inputFile).size;
    const checksum = crypto.createHash("sha256").update(fs.readFileSync(inputFile)).digest("hex");
    report.notices.push({ message: `Input size: ${size} bytes, sha256: ${checksum}` });
  }
  if (exitCodeFile && fs.existsSync(exitCodeFile)) {
    const code = fs.readFileSync(exitCodeFile, "utf-8").trim();
    report.notices.push({ message: `Pytest coverage exit code: ${code}` });
  }

  // Add timestamp
  report.notices.push({ message: `Timestamp: ${new Date().toISOString()}` });
} catch (e) {
  report.status = "failure";
  report.errors.push({
    file: "converter",
    message: `Pytest coverage converter crashed: ${e.message}`,
    rule: "runtime",
    severity: "error"
  });
}

fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));