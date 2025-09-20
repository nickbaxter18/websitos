#!/usr/bin/env node
const fs = require("fs");

if (process.argv.length < 4) {
  console.error("Usage: node convert-eslint.js <input> <output>");
  process.exit(1);
}

const [inputFile, outputFile] = process.argv.slice(2);
const raw = JSON.parse(fs.readFileSync(inputFile, "utf-8"));

const summary = {
  workflow: "frontend-checks",
  job: "lint",
  status: "success",
  errors: [],
  warnings: [],
  notices: []
};

raw.forEach(result => {
  result.messages.forEach(msg => {
    const entry = {
      file: result.filePath.replace(process.cwd() + "/", ""),
      line: msg.line,
      column: msg.column,
      message: msg.message,
      rule: msg.ruleId || "unknown",
      severity: msg.severity === 2 ? "error" : "warning",
      suggestion: msg.fix ? "Autofix available with eslint --fix" : null
    };
    if (msg.severity === 2) {
      summary.errors.push(entry);
      summary.status = "failure";
    } else {
      summary.warnings.push(entry);
    }
  });
});

fs.writeFileSync(outputFile, JSON.stringify(summary, null, 2));
console.log(`✅ ESLint summary written to ${outputFile}`);