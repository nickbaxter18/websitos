#!/usr/bin/env node

const fs = require("fs");
const crypto = require("crypto");

const inputFile = process.argv[2];
const outputFile = process.argv[3];
const exitCodeFile = process.argv[4] || null;

let report = {
  workflow: "frontend-checks",
  job: "prettier",
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
      message: "Prettier input file missing or empty",
      rule: "prettier",
      severity: "error"
    });
  } else {
    const content = fs.readFileSync(inputFile, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, idx) => {
      if (line.includes("code style issues found")) {
        report.status = "failure";
        report.errors.push({
          file: "?",
          line: idx + 1,
          message: line.trim(),
          rule: "prettier",
          severity: "error"
        });
      } else if (line.includes("formatted")) {
        report.status = "failure";
        report.warnings.push({
          file: "?",
          line: idx + 1,
          message: line.trim(),
          rule: "prettier",
          severity: "warning"
        });
      }
    });
  }

  // Add metadata
  if (fs.existsSync(inputFile)) {
    const size = fs.statSync(inputFile).size;
    const checksum = crypto.createHash("sha256").update(fs.readFileSync(inputFile)).digest("hex");
    report.notices.push({ message: `Input size: ${size} bytes, sha256: ${checksum}` });
  }
  if (exitCodeFile && fs.existsSync(exitCodeFile)) {
    const code = fs.readFileSync(exitCodeFile, "utf-8").trim();
    report.notices.push({ message: `Prettier exit code: ${code}` });
  }

  // Add timestamp
  report.notices.push({ message: `Timestamp: ${new Date().toISOString()}` });
} catch (e) {
  report.status = "failure";
  report.errors.push({
    file: "converter",
    message: `Prettier converter crashed: ${e.message}`,
    rule: "runtime",
    severity: "error"
  });
}

fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));