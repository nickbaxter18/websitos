#!/usr/bin/env node
const fs = require("fs");

if (process.argv.length < 4) {
  console.error("Usage: node convert-tsc.js <input> <output>");
  process.exit(1);
}

const [inputFile, outputFile] = process.argv.slice(2);
const lines = fs.existsSync(inputFile)
  ? fs.readFileSync(inputFile, "utf-8").split("\n")
  : [];

const summary = {
  workflow: "frontend-checks",
  job: "tsc",
  status: "success",
  errors: [],
  warnings: [],
  notices: []
};

const regex = /^(.*\.ts[x]?):(\d+):(\d+) - error (TS\d+): (.*)$/;

lines.forEach(line => {
  const match = regex.exec(line.trim());
  if (match) {
    const [, file, lineNo, colNo, code, message] = match;
    summary.errors.push({
      file,
      line: parseInt(lineNo, 10),
      column: parseInt(colNo, 10),
      message,
      rule: code,
      severity: "error",
      suggestion: null
    });
    summary.status = "failure";
  }
});

fs.writeFileSync(outputFile, JSON.stringify(summary, null, 2));
console.log(`✅ TSC summary written to ${outputFile}`);