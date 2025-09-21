#!/usr/bin/env node

const fs = require("fs");
const crypto = require("crypto");

const inputFile = process.argv[2]; // playwright-output.txt
const coverageFile = process.argv[3]; // coverage summary json
const outputFile = process.argv[4];
const exitCodeFile = process.argv[5] || null;

let report = {
  workflow: "frontend-checks",
  job: "playwright-e2e",
  status: "success",
  errors: [],
  warnings: [],
  notices: []
};

try {
  // Check input logs
  if (!fs.existsSync(inputFile) || fs.statSync(inputFile).size === 0) {
    report.status = "failure";
    report.errors.push({
      file: inputFile || "?",
      message: "Playwright log file missing or empty",
      rule: "playwright",
      severity: "error"
    });
  } else {
    const content = fs.readFileSync(inputFile, "utf-8");
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      if (line.includes("Error") || line.includes("FAIL")) {
        report.status = "failure";
        report.errors.push({
          file: inputFile,
          line: idx + 1,
          message: line.trim(),
          rule: "playwright",
          severity: "error"
        });
      }
    });
  }

  // Check coverage file
  if (coverageFile && fs.existsSync(coverageFile)) {
    try {
      const covRaw = fs.readFileSync(coverageFile, "utf-8");
      const cov = JSON.parse(covRaw);
      if (cov.total) {
        const { lines, branches, functions, statements } = cov.total;
        report.notices.push({
          message: `Coverage summary: lines=${lines.pct}%, branches=${branches.pct}%, functions=${functions.pct}%, statements=${statements.pct}%`
        });
      }
      const size = fs.statSync(coverageFile).size;
      const checksum = crypto.createHash("sha256").update(fs.readFileSync(coverageFile)).digest("hex");
      report.notices.push({ message: `Coverage file size: ${size} bytes, sha256: ${checksum}` });
    } catch (e) {
      report.warnings.push({
        file: coverageFile,
        message: `Failed to parse coverage JSON: ${e.message}`,
        rule: "coverage",
        severity: "warning"
      });
    }
  } else {
    report.warnings.push({
      file: coverageFile || "?",
      message: "No coverage summary found for Playwright",
      rule: "coverage",
      severity: "warning"
    });
  }

  // Add metadata for input logs
  if (fs.existsSync(inputFile)) {
    const size = fs.statSync(inputFile).size;
    const checksum = crypto.createHash("sha256").update(fs.readFileSync(inputFile)).digest("hex");
    report.notices.push({ message: `Log size: ${size} bytes, sha256: ${checksum}` });
  }
  if (exitCodeFile && fs.existsSync(exitCodeFile)) {
    const code = fs.readFileSync(exitCodeFile, "utf-8").trim();
    report.notices.push({ message: `Playwright exit code: ${code}` });
  }

  // Add timestamp
  report.notices.push({ message: `Timestamp: ${new Date().toISOString()}` });
} catch (e) {
  report.status = "failure";
  report.errors.push({
    file: "converter",
    message: `Playwright converter crashed: ${e.message}`,
    rule: "runtime",
    severity: "error"
  });
}

fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));