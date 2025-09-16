#!/usr/bin/env node

const fs = require("fs");

// Thresholds — keep in sync with codecov.yml and coverage.config.json
const thresholds = {
  lines: 80,
  branches: 75,
  functions: 80,
  statements: 80,
};

if (process.argv.length < 3) {
  console.error("Usage: node scripts/annotate-coverage.js <coverage-summary.json>");
  process.exit(1);
}

const file = process.argv[2];
if (!fs.existsSync(file)) {
  console.error(`::error::Coverage file not found: ${file}`);
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(file, "utf8"));

function check(name, actual, target) {
  if (actual < target) {
    console.error(`::error file=frontend/tests::${name} coverage ${actual}% < target ${target}%`);
    return false;
  }
  return true;
}

let ok = true;
ok &= check("Lines", summary.total.lines.pct, thresholds.lines);
ok &= check("Branches", summary.total.branches.pct, thresholds.branches);
ok &= check("Functions", summary.total.functions.pct, thresholds.functions);
ok &= check("Statements", summary.total.statements.pct, thresholds.statements);

if (!ok) {
  process.exit(1);
}
console.log("✅ Coverage meets thresholds");