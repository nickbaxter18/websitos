#!/usr/bin/env node

const fs = require("fs");

const inputFile = process.argv[2];
const outputFile = process.argv[3];

let report = {
  workflow: "backend-checks",
  job: "black",
  status: "success",
  errors: [],
  warnings: [],
  notices: []
};

try {
  const content = fs.readFileSync(inputFile, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, idx) => {
    if (line.includes("would reformat")) {
      report.status = "failure";
      report.warnings.push({
        file: line.split("would reformat")[0].trim(),
        line: idx + 1,
        message: "File not formatted according to Black",
        rule: "black",
        severity: "warning",
        suggestion: "Run `black .` to reformat"
      });
    }
    if (line.includes("error") || line.includes("Traceback")) {
      report.status = "failure";
      report.errors.push({
        file: "?",
        line: idx + 1,
        message: line.trim(),
        rule: "runtime",
        severity: "error"
      });
    }
  });
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