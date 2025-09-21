#!/usr/bin/env node

const fs = require("fs");
const crypto = require("crypto");

const inputFile = process.argv[2];
const outputFile = process.argv[3];
const exitCodeFile = process.argv[4] || null;

let report = {
  workflow: "frontend-checks",
  job: "lint",
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
      message: "ESLint input file missing or empty",
      rule: "eslint",
      severity: "error"
    });
  } else {
    const raw = fs.readFileSync(inputFile, "utf-8");
    const data = JSON.parse(raw);

    if (Array.isArray(data) && data.length > 0) {
      data.forEach((file) => {
        if (file.messages && file.messages.length > 0) {
          report.status = "failure";
          file.messages.forEach((m) => {
            const entry = {
              file: file.filePath || "?",
              line: m.line || "?",
              message: m.message || "",
              rule: m.ruleId || "eslint",
              severity: m.severity === 2 ? "error" : "warning"
            };
            if (m.fix) entry.suggestion = "Auto-fix available";
            report[m.severity === 2 ? "errors" : "warnings"].push(entry);
          });
        }
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
    report.notices.push({ message: `ESLint exit code: ${code}` });
  }

  // Add timestamp
  report.notices.push({ message: `Timestamp: ${new Date().toISOString()}` });
} catch (e) {
  report.status = "failure";
  report.errors.push({
    file: "converter",
    message: `ESLint converter crashed: ${e.message}`,
    rule: "runtime",
    severity: "error"
  });
}

fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));