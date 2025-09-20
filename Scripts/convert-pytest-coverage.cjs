#!/usr/bin/env node

const fs = require("fs");

const inputFile = process.argv[2];
const outputFile = process.argv[3];

let report = {
  workflow: "coverage-checks",
  job: "backend-coverage",
  status: "success",
  errors: [],
  warnings: [],
  notices: []
};

try {
  const content = fs.readFileSync(inputFile, "utf-8");
  const data = JSON.parse(content);

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