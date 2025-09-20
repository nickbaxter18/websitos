#!/usr/bin/env node
const fs = require("fs");

if (process.argv.length < 4) {
  console.error("Usage: node convert-jest-coverage.js <input> <output>");
  process.exit(1);
}

const [inputFile, outputFile] = process.argv.slice(2);
const raw = JSON.parse(fs.readFileSync(inputFile, "utf-8"));

const summary = {
  workflow: "coverage-checks",
  job: "jest-coverage",
  status: "success",
  errors: [],
  warnings: [],
  notices: []
};

const thresholds = { statements: 90, branches: 80, functions: 90, lines: 90 };

Object.keys(thresholds).forEach(metric => {
  const pct = raw.total[metric]?.pct || 0;
  if (pct < thresholds[metric]) {
    summary.errors.push({
      file: "ALL",
      line: null,
      message: `${metric} coverage ${pct}% below threshold ${thresholds[metric]}%`,
      rule: "coverage-threshold",
      severity: "error",
      suggestion: "Add more tests to improve coverage."
    });
    summary.status = "failure";
  }
});

fs.writeFileSync(outputFile, JSON.stringify(summary, null, 2));
console.log(`✅ Jest coverage summary written to ${outputFile}`);