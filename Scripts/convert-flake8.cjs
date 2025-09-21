#!/usr/bin/env node

const fs = require("fs");
const crypto = require("crypto");

const inputFile = process.argv[2];
const outputFile = process.argv[3];
const exitCodeFile = process.argv[4] || null;

let report = {
  workflow: "backend-checks",
  job: "flake8",
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
      message: "Flake8 input file missing or empty",
      rule: "flake8",
      severity: "error"
    });
  } else {
    const content = fs.readFileSync(inputFile, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, idx) => {
      if (line.trim().length === 0) return;
      const parts = line.split(":");
      if (parts.length >= 3) {
        report.status = "failure";
        report.errors.push({
          file: parts[0] || "?",
          line: parts[1] || idx + 1,
          message: parts.slice(2).join(":").trim(),
          rule: "flake8",
          severity: "error"
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
    report.notices.push({ message: `Flake8 exit code: ${code}` });
  }

  // Add timestamp
  report.notices.push({ message: `Timestamp: ${new Date().toISOString()}` });
} catch (e) {
  report.status = "failure";
  report.errors.push({
    file: "converter",
    message: `Flake8 converter crashed: ${e.message}`,
    rule: "runtime",
    severity: "error"
  });
}

fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));