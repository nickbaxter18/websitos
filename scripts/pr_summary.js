import fs from "fs";
import { execSync } from "child_process";

function getCoverage() {
  try {
    const coverage = JSON.parse(fs.readFileSync("coverage/coverage-summary.json", "utf-8"));
    return coverage.total.statements.pct + "%";
  } catch {
    return "N/A";
  }
}

function getBuildSize() {
  try {
    const size = execSync("du -sh dist").toString().split("\t")[0];
    return size;
  } catch {
    return "N/A";
  }
}

function getFrontendTests() {
  try {
    const results = fs.readFileSync("jest-report.json", "utf-8");
    const parsed = JSON.parse(results);
    const { numPassedTests, numFailedTests, numTotalTests } = parsed;
    return `✅ Passed: ${numPassedTests}, ❌ Failed: ${numFailedTests}, Total: ${numTotalTests}`;
  } catch {
    return "N/A";
  }
}

function getBackendTests() {
  try {
    execSync("pytest --maxfail=1 --disable-warnings -q --json-report --json-report-file=pytest-report.json || true");
    if (fs.existsSync("pytest-report.json")) {
      const parsed = JSON.parse(fs.readFileSync("pytest-report.json", "utf-8"));
      const { summary, tests } = parsed;
      return `✅ Passed: ${summary.passed}, ❌ Failed: ${summary.failed}, Total: ${tests.length}`;
    }
    return "N/A";
  } catch {
    return "N/A";
  }
}

function getOpenAPIValidation() {
  try {
    execSync("python scripts/validate_openapi.py", { stdio: "pipe" });
    return "✅ OpenAPI valid";
  } catch {
    return "❌ OpenAPI validation failed";
  }
}

const summary = `\n📊 Coverage: ${getCoverage()}\n📦 Build size: ${getBuildSize()}\n🧪 Frontend Tests: ${getFrontendTests()}\n🧪 Backend Tests: ${getBackendTests()}\n📜 OpenAPI: ${getOpenAPIValidation()}\n`;

const copyBlock = `\n📋 Copy the block below for debugging:\n\n\n\u0060\u0060\u0060\n${summary}\u0060\u0060\u0060\n`;

const runId = process.env.GITHUB_RUN_ID;
const repo = process.env.GITHUB_REPOSITORY;
const artifactLink = `https://github.com/${repo}/suites/${runId}/artifacts`;

const downloadNote = `\n📂 [Download full debug bundle](${artifactLink})\n`;

const triageGuide = `\n🛠️ Quick Triage Guide:\n- ❌ Env validation failed → check required variables in .env/.github secrets.\n- ❌ Asset verification failed → inspect dist/ and ensure all hashed assets exist.\n- ❌ Frontend unit tests failed → check [jest-report.json](${artifactLink}) inside ci-debug-artifacts.zip.\n- ❌ Frontend coverage issues → review [coverage report](${artifactLink}).\n- ❌ Backend tests failed → download [pytest-report.json](${artifactLink}) inside ci-debug-artifacts.zip.\n- ❌ OpenAPI validation failed → review api routes and schema (see backend logs in [uvicorn_openapi.log](${artifactLink})).\n- ❌ Playwright failures → check screenshots in [playwright-report](${artifactLink}).\n`;

console.log(summary + copyBlock + downloadNote + triageGuide);
fs.writeFileSync("pr_summary.txt", summary + copyBlock + downloadNote + triageGuide);
fs.writeFileSync("full_logs.txt", summary);