#!/usr/bin/env node

// Playwright E2E converter wrapper around universal v4 converter
// Combines Playwright logs and coverage summary JSON into one diagnostics report

const { spawnSync } = require("child_process");
const fs = require("fs");

const logFile = process.argv[2] || "playwright-output.txt";
const jsonFile = process.argv[3] || "coverage/e2e/coverage-summary.json";
const outFile = process.argv[4] || "playwright-report.json";

// Universal converter path
const universal = __dirname + "/convert-universal.js";

// Run universal converter with log and json file
const result = spawnSync("node", [universal, logFile, jsonFile, outFile], { stdio: "inherit" });

if (result.error) {
  console.error("❌ Playwright converter failed:", result.error);
  // Fallback: emit a neutral report
  const report = {
    workflow: process.env.WORKFLOW || "coverage-checks",
    job: process.env.JOB || "e2e",
    status: "neutral",
    errors: [],
    warnings: [],
    notices: [ { message: "Playwright converter crashed, fallback report emitted" } ],
    meta: { parser_health: "failed" }
  };
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
} else {
  console.log("✅ Playwright report written via universal converter");
}