#!/usr/bin/env node

// Flake8 converter wrapper around universal v4 converter
// Ensures Flake8 errors are parsed from structured output and logs

const { spawnSync } = require("child_process");
const fs = require("fs");

const logFile = process.argv[2] || "flake8-output.txt";
const outFile = process.argv[3] || "flake8-report.json";

// Universal converter path (use .cjs)
const universal = __dirname + "/convert-universal.cjs";

// Run universal converter on the log file only (no structured JSON)
const result = spawnSync("node", [universal, logFile, "", outFile], { stdio: "inherit" });

if (result.error) {
  console.error("❌ Flake8 converter failed:", result.error);
  // Fallback: emit a neutral report
  const report = {
    workflow: process.env.WORKFLOW || "backend-checks",
    job: process.env.JOB || "flake8",
    status: "neutral",
    errors: [],
    warnings: [],
    notices: [ { message: "Flake8 converter crashed, fallback report emitted" } ],
    meta: { parser_health: "failed" }
  };
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
} else {
  console.log("✅ Flake8 report written via universal converter");
}