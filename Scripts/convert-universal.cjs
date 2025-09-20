#!/usr/bin/env node

// Hardened Universal Converter v4 (CommonJS version)
// Parses structured JSON + scans logs across multiple files to catch all errors/warnings.
// Categorizes, deduplicates, and guarantees resilient output.

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

const logFiles = process.argv[2] ? process.argv[2].split(",") : []; // comma-separated log files
const jsonFile = process.argv[3];
const outFile = process.argv[4];

let report = {
  workflow: process.env.WORKFLOW || "unknown",
  job: process.env.JOB || "unknown",
  status: "success",
  errors: [],
  warnings: [],
  notices: [],
  meta: {}
};

const seen = new Map(); // deduplication

// Utility: strip ANSI escape codes
function stripAnsi(str) {
  return str.replace(/\u001b\[[0-9;]*m/g, "");
}

function addEntry(type, message, line = "?", file = "?", rule = "runtime", category = "runtime", context = "") {
  message = stripAnsi(message);
  const key = crypto.createHash("md5").update(type + message + rule + category).digest("hex");
  if (seen.has(key)) {
    seen.get(key).count++;
    return;
  }
  const entry = { file, line, message: message.trim(), rule, severity: type, category, count: 1 };
  if (context) entry.context = context;
  seen.set(key, entry);
  if (type === "error") report.errors.push(entry);
  else if (type === "warning") report.warnings.push(entry);
  else report.notices.push(entry);
}

// 1. Parse structured JSON
if (jsonFile && fs.existsSync(jsonFile)) {
  try {
    const data = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
    if (Array.isArray(data)) {
      data.forEach((d) => addEntry(d.severity || "warning", d.message || JSON.stringify(d), "?", jsonFile, "tool", "tool"));
    } else if (data && typeof data === "object") {
      if (data.errors) data.errors.forEach((e) => addEntry("error", e.message || JSON.stringify(e), "?", jsonFile, "tool", "tool"));
      if (data.warnings) data.warnings.forEach((w) => addEntry("warning", w.message || JSON.stringify(w), "?", jsonFile, "tool", "tool"));
    }
  } catch (err) {
    report.status = "failure";
    addEntry("error", `Failed to parse JSON: ${err.message}`, "?", jsonFile, "parser", "system");
  }
} else if (jsonFile) {
  addEntry("error", `Expected structured output missing: ${jsonFile}`, "?", jsonFile, "missing-json", "system");
}

// Regex libraries
const errorRegex = /(error|failed|exception|traceback|fatal|not found|enoent|segmentation fault|panic|undefined|cannot|permission denied|nullpointer|classnotfound|oom|outofmemory|exit code [1-9][0-9]*|timeout|timed out|cancelled|exceeded)/i;
const warnRegex = /(warn|deprecated|notice|experimental|insecure|slow|retry)/i;

// Language detection helpers
function detectLanguage(line) {
  if (/Traceback/.test(line)) return "python";
  if (/UnhandledPromiseRejection|ReferenceError|TypeError/.test(line)) return "node";
  if (/NullPointerException|ClassNotFoundException/.test(line)) return "java";
  return "generic";
}

let totalLines = 0;

// 2. Scan log files
for (const file of logFiles) {
  if (!fs.existsSync(file)) {
    addEntry("notice", `Log file missing: ${file}`, "?", file, "missing-log", "system");
    continue;
  }

  let content = fs.readFileSync(file);
  if (file.endsWith(".gz")) {
    try {
      content = zlib.gunzipSync(content);
    } catch (err) {
      addEntry("error", `Failed to decompress log: ${file} (${err.message})`, "?", file, "parser", "system");
      continue;
    }
  }

  const lines = content.toString("utf8").split("\n");
  totalLines += lines.length;

  for (let i = 0; i < lines.length; i++) {
    let line = stripAnsi(lines[i]);
    if (errorRegex.test(line)) {
      report.status = "failure";
      let context = [line];
      for (let j = 1; j <= 200 && i + j < lines.length; j++) {
        if (lines[i + j].trim() === "") break;
        context.push(stripAnsi(lines[i + j]));
      }
      addEntry("error", context.join("\n"), i + 1, file, "runtime", detectLanguage(line));
    } else if (warnRegex.test(line)) {
      addEntry("warning", line, i + 1, file, "runtime", detectLanguage(line));
    }
  }
}

// 3. Exit code awareness
if (fs.existsSync("exit-code.txt")) {
  try {
    const code = fs.readFileSync("exit-code.txt", "utf8").trim();
    if (code !== "0") {
      report.status = "failure";
      addEntry("error", `Process exited with code ${code}`, "?", "?", "exit", "system");
    }
  } catch (err) {
    addEntry("warning", `Failed to read exit code: ${err.message}`, "?", "?", "runtime", "system");
  }
}

// 4. Determine final status
if (report.errors.length > 0) report.status = "failure";
else if (report.warnings.length > 0) report.status = "neutral";
else if (report.notices.length > 0) report.status = "neutral";
else report.status = "success";

// 5. Guarantee output
if (!report.errors.length && !report.warnings.length && !report.notices.length) {
  addEntry("notice", "No issues detected in logs or JSON, tool may have exited cleanly or failed silently.", "?", "?", "fallback", "system");
}

// 6. Add meta info
report.meta = {
  files_scanned: logFiles.length,
  lines_scanned: totalLines,
  errors: report.errors.length,
  warnings: report.warnings.length,
  notices: report.notices.length,
  parser_health: "ok"
};

// 7. Safe write with truncation
try {
  let output = JSON.stringify(report, null, 2);
  if (output.length > 60000) {
    addEntry("notice", "Report truncated due to size limit", "?", "?", "truncation", "system");
    output = output.slice(0, 60000);
  }
  fs.writeFileSync(outFile, output);
  console.log(`✅ Converter finished. Errors: ${report.errors.length}, Warnings: ${report.warnings.length}, Notices: ${report.notices.length}`);
} catch (err) {
  console.error("❌ Failed to write report:", err);
  process.exit(1);
}