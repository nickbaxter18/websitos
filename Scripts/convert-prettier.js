#!/usr/bin/env node
const fs = require("fs");

if (process.argv.length < 4) {
  console.error("Usage: node convert-prettier.js <input> <output>");
  process.exit(1);
}

const [inputFile, outputFile] = process.argv.slice(2);
const raw = fs.readFileSync(inputFile, "utf-8").trim().split("\n");

const summary = {
  workflow: "frontend-checks",
  job: "prettier",
  status: "success",
  errors: [],
  warnings: [],
  notices: []
};

raw.forEach(line => {
  if (!line || line.includes("All matched files use Prettier code style")) return;

  const entry = {
    file: line.trim(),
    line: null,
    column: null,
    message: "File does not match Prettier formatting",
    rule: "prettier",
    severity: "warning", // always warning, not error
    suggestion: "Run `npx prettier --write <file>`"
  };

  summary.warnings.push(entry);
  summary.status = "failure";
});

fs.writeFileSync(outputFile, JSON.stringify(summary, null, 2));
console.log(`✅ Prettier summary written to ${outputFile}`);