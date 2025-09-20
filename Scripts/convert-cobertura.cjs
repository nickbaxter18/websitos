#!/usr/bin/env node

const fs = require("fs");
const { DOMParser } = require("xmldom");

const inputFile = process.argv[2];
const outputFile = process.argv[3];

let report = {
  workflow: "coverage-checks",
  job: "backend-cobertura",
  status: "success",
  errors: [],
  warnings: [],
  notices: []
};

try {
  const xmlContent = fs.readFileSync(inputFile, "utf-8");
  const doc = new DOMParser().parseFromString(xmlContent, "application/xml");

  const linesValid = doc.getElementsByTagName("line-rate")[0]?.textContent;
  const branchesValid = doc.getElementsByTagName("branch-rate")[0]?.textContent;

  if (!linesValid || !branchesValid) {
    report.status = "failure";
    report.errors.push({
      file: inputFile,
      message: "Cobertura XML missing coverage rates",
      rule: "cobertura",
      severity: "error"
    });
  } else {
    report.notices.push({
      message: `Line-rate: ${linesValid}, Branch-rate: ${branchesValid}`
    });
  }
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