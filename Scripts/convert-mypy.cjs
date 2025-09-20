#!/usr/bin/env node

const fs = require("fs");

const inputFile = process.argv[2];
const outputFile = process.argv[3];

let report = {
  workflow: "backend-checks",
  job: "mypy",
  status: "success",
  errors: [],
  warnings: [],
  notices: []
};

try {
  const content = fs.readFileSync(inputFile, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, idx) => {
    if (line.includes(": error:")) {
      report.status = "failure";
      const parts = line.split(":");
      report.errors.push({
        file: parts[0] || "?",
        line: parts[1] || "?",
        message: parts.slice(2).join(":").trim(),
        rule: "mypy",
        severity: "error"
      });
    } else if (line.includes(": note:")) {
      report.notices.push({
        file: "?",
        line: idx + 1,
        message: line.trim()
      });
    }
  });
} catch (e) {
  report.status = "failure";
  report.errors.push({
    file: "converter",
    message: `Mypy converter crashed: ${e.message}`,
    rule: "runtime",
    severity: "error"
  });
}

fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));