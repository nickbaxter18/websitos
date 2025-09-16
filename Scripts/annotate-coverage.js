#!/usr/bin/env node
/**
 * Annotates Jest coverage summary with GitHub Actions errors.
 * Usage: node scripts/annotate-coverage.js coverage/coverage-summary.json
 */

const fs = require("fs");
const path = require("path");

// Load thresholds from coverage.config.json
const configPath = path.resolve(__dirname, "../coverage.config.json");
const thresholds = JSON.parse(fs.readFileSync(configPath, "utf8")).thresholds;

function emitError(file, line, msg) {
  console.log(`::error file=${file},line=${line}::${msg}`);
}

function main() {
  const inputFile = process.argv[2];
  if (!inputFile || !fs.existsSync(inputFile)) {
    console.error(`Coverage file not found: ${inputFile}`);
    process.exit(0); // Don't hard fail if missing
  }

  const summary = JSON.parse(fs.readFileSync(inputFile, "utf8"));

  Object.entries(summary.total).forEach(([metric, data]) => {
    if (thresholds[metric] && data.pct < thresholds[metric]) {
      emitError(
        "coverage/coverage-summary.json",
        1,
        `Jest ${metric} coverage ${data.pct}% < required ${thresholds[metric]}%`
      );
      process.exitCode = 1;
    }
  });
}

main();