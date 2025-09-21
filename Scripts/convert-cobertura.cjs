#!/usr/bin/env node

const fs = require("fs");
const crypto = require("crypto");
const { DOMParser } = require("xmldom");

const inputFile = process.argv[2];
const outputFile = process.argv[3];
const exitCodeFile = process.argv[4] || null;

const workflow = "coverage-checks";
const job = "backend-cobertura";

function fallback(errMsg) {
  const report = {
    workflow,
    job,
    status: "failure",
    errors: [{ message: errMsg }],
    warnings: [],
    notices: []
  };
  fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
  console.error(`❌ ${errMsg}`);
}

try {
  if (!fs.existsSync(inputFile) || fs.statSync(inputFile).size === 0) {
    return fallback(`Cobertura XML missing or empty: ${inputFile}`);
  }

  const xmlContent = fs.readFileSync(inputFile, "utf-8");
  const doc = new DOMParser().parseFromString(xmlContent, "application/xml");

  const lineRate = doc.documentElement.getAttribute("line-rate");
  const branchRate = doc.documentElement.getAttribute("branch-rate");

  const report = {
    workflow,
    job,
    status: "success",
    errors: [],
    warnings: [],
    notices: []
  };

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

  // Add metadata
  const size = fs.statSync(inputFile).size;
  const checksum = crypto.createHash("sha256").update(xmlContent).digest("hex");
  report.notices.push({ message: `Input size: ${size} bytes` });
  report.notices.push({ message: `sha256: ${checksum}` });

  if (exitCodeFile && fs.existsSync(exitCodeFile)) {
    const code = fs.readFileSync(exitCodeFile, "utf-8").trim();
    report.notices.push({ message: `Cobertura parser exit code: ${code}` });
  }

  report.notices.push({ message: `Timestamp: ${new Date().toISOString()}` });

  fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
  console.log(`✅ Cobertura coverage summary written to ${outputFile}`);
} catch (e) {
  fallback(`Cobertura converter crashed: ${e.message}`);
}