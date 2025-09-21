#!/usr/bin/env node

const fs = require("fs");
const crypto = require("crypto");

const inputFile = process.argv[2];
const outputFile = process.argv[3];
const exitCodeFile = process.argv[4] || null;

let report = {
  workflow: "backend-checks",
  job: "black",
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
      message: "Black input file missing or empty",
      rule: "black",
      severity: "error"
    });
  } else {
    const content = fs.readFileSync(inputFile, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, idx) => {
      if (line.includes("would reformat")) {
        report.status = "failure";
        report.warnings.push({
          file: line.split("would reformat")[0].trim() || "?",
          line: idx + 1,
          message: "File not formatted according to Black",
          rule: "black",
          severity: "warning",
          suggestion: "Run `black .` to reformat"
        });
      }
      if (line.toLowerCase().includes("error") || line.includes("Traceback")) {
        report.status = "failure";
        report.errors.push({
          file: inputFile,
          line: idx + 1,
          message: line.trim(),
          rule: "runtime",
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
    report.notices.push({ message: `Black exit code: ${code}` });
  }

  // Add timestamp
  report.notices.push({ message: `Timestamp: ${new Date().toISOString()}` });
} catch (e) {
  report.status = "failure";
  report.errors.push({
    file: "converter",
    message: `Black converter crashed: ${e.message}`,
    rule: "runtime",
    severity: "error"
  });
}

fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));