#!/usr/bin/env node
const fs = require("fs");

if (process.argv.length < 4) {
  console.error("Usage: node convert-jest.js <input> <output>");
  process.exit(1);
}

const [inputFile, outputFile] = process.argv.slice(2);
let raw = { testResults: [] };
if (fs.existsSync(inputFile)) {
  raw = JSON.parse(fs.readFileSync(inputFile, "utf-8"));
}

const summary = {
  workflow: "frontend-checks",
  job: "jest-unit",
  status: "success",
  errors: [],
  warnings: [],
  notices: []
};

raw.testResults.forEach(test => {
  if (test.status === "failed") {
    const failureMessage = test.message || "Test failed";
    const stack = (test.failureMessages && test.failureMessages.join("\n")) || "";

    summary.errors.push({
      file: test.name || "unknown",
      line: null,
      column: null,
      message: failureMessage,
      rule: "jest",
      severity: "error",
      suggestion: null,
      details: stack.split("\n").slice(0, 5).join("\n") // include first 5 lines of stack
    });
    summary.status = "failure";
  }
});

fs.writeFileSync(outputFile, JSON.stringify(summary, null, 2));
console.log(`✅ Jest summary written to ${outputFile}`);