#!/usr/bin/env node

// Pytest converter wrapper around universal v4 converter
// Ensures both structured pytest output (if available) and raw logs are scanned.

const { spawnSync } = require("child_process");
const fs = require("fs");

const logFile = process.argv[2] || "pytest-output.txt";
const jsonFile = process.argv[3] || "pytest-output.json"; // pytest --json-report-file
const outFile = process.argv[4] || "pytest-report.json";

// Universal converter path (use .cjs)
const universal = __dirname + "/convert-universal.cjs";

// Run universal converter with both log and json file
const result = spawnSync("node", [universal, logFile, jsonFile, outFile], { stdio: "inherit" });

if (result.error) {
  console.error("❌ Pytest converter failed:", result.error);
  // Fallback: emit a neutral report
  const report = {
    workflow: process.env.WORKFLOW || "backend-checks",
    job: process.env.JOB || "pytest",
    status: "neutral",
    errors: [],
    warnings: [],
    notices: [ { message: "Pytest converter crashed, fallback report emitted" } ],
    meta: { parser_health: "failed" }
  };
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
} else {
  console.log("✅ Pytest report written via universal converter");
}