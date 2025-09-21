#!/usr/bin/env node

const fs = require("fs");
const crypto = require("crypto");

const inputFile = process.argv[2];
const outputFile = process.argv[3];
const exitCodeFile = process.argv[4] || null;

let report = {
  workflow: "frontend-checks",
  job: "jest-unit",
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
      message: "Jest input file missing or empty",
      rule: "jest",
      severity: "error"
    });
  } else {
    const raw = fs.readFileSync(inputFile, "utf-8");
    const data = JSON.parse(raw);

    if (data.testResults && data.testResults.length > 0) {
      data.testResults.forEach((tr) => {
        tr.assertionResults.forEach((ar) => {
          if (ar.status === "failed") {
            report.status = "failure";
            report.errors.push({
              file: tr.name || "?",
              message: ar.failureMessages.join(" | ") || "Jest test failed",
              rule: "jest",
              severity: "error"
            });
          }
        });
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
    report.notices.push({ message: `Jest exit code: ${code}` });
  }

  // Add timestamp
  report.notices.push({ message: `Timestamp: ${new Date().toISOString()}` });
} catch (e) {
  report.status = "failure";
  report.errors.push({
    file: "converter",
    message: `Jest converter crashed: ${e.message}`,
    rule: "runtime",
    severity: "error"
  });
}

fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));