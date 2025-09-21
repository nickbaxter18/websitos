#!/usr/bin/env node

const fs = require("fs");
const crypto = require("crypto");
const { DOMParser } = require("xmldom");

const inputFile = process.argv[2];
const outputFile = process.argv[3];
const exitCodeFile = process.argv[4] || null;

let report = {
  workflow: "coverage-checks",
  job: "backend-cobertura",
  status: "success",
  errors: [],
  warnings: [],
  notices: []
};

try {
  if (!fs.existsSync(inputFile) || fs.statSync(inputFile).size === 0) {
    report.status = "failure";
    report.errors.push({
      file: inputFile || "?",
      message: "Cobertura XML missing or empty",
      rule: "cobertura",
      severity: "error"
    });
  } else {
    const xmlContent = fs.readFileSync(inputFile, "utf-8");
    const doc = new DOMParser().parseFromString(xmlContent, "application/xml");

    const lineRate = doc.documentElement.getAttribute("line-rate");
    const branchRate = doc.documentElement.getAttribute("branch-rate");

    if (!lineRate || !branchRate) {
      report.status = "failure";
      report.errors.push({
        file: inputFile,
        message: "Cobertura XML missing line-rate or branch-rate",
        rule: "cobertura",
        severity: "error"
      });
    } else {
      report.notices.push({ message: `Line-rate: ${lineRate}, Branch-rate: ${branchRate}` });
    }
  }

  // Add metadata
  if (fs.existsSync(inputFile)) {
    const size = fs.statSync(inputFile).size;
    const checksum = crypto.createHash("sha256").update(fs.readFileSync(inputFile)).digest("hex");
    report.notices.push({ message: `Input size: ${size} bytes, sha256: ${checksum}` });
  }
  if (exitCodeFile && fs.existsSync(exitCodeFile)) {
    const code = fs.readFileSync(exitCodeFile, "utf-8").trim();
    report.notices.push({ message: `Cobertura parser exit code: ${code}` });
  }

  // Add timestamp
  report.notices.push({ message: `Timestamp: ${new Date().toISOString()}` });
} catch (e) {
  report.status = "failure";
  report.errors.push({
    file: "converter",
    message: `Cobertura converter crashed: ${e.message}`,
    rule: "runtime",
    severity: "error"
  });
}

fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));