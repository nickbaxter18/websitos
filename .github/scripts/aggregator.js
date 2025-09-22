const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

try {
  const workspaceDir = process.env.GITHUB_WORKSPACE || process.cwd();
  const baseDir = path.join(workspaceDir, "summaries");
  const schemaPath = path.join(workspaceDir, "diagnostics.schema.json");
  const localAjv = path.join(workspaceDir, ".agg_tmp", "node_modules", ".bin", "ajv");
  const ajvCommand = fs.existsSync(localAjv)
    ? `"${localAjv}"`
    : "npx --yes --package ajv-cli ajv";

  const allReports = [];
  const processedFiles = [];
  let schemaFailures = 0;
  let schemaPasses = 0;

  function validateSchema(file) {
    try {
      execSync(`${ajvCommand} validate -s "${schemaPath}" -d "${file}"`, {
        stdio: "pipe",
        cwd: workspaceDir
      });
      schemaPasses++;
      return null;
    } catch (e) {
      schemaFailures++;
      return e.toString();
    }
  }

  function loadFiles(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        loadFiles(full);
        continue;
      }

      if (!entry.name.endsWith(".json")) continue;

      const rel = path.relative(workspaceDir, full) || entry.name;
      const isFallback = entry.name.endsWith("-fallback.json");
      if (isFallback) {
        processedFiles.push(`⚠️ Fallback: ${rel}`);
        const baseName = entry.name.replace("-fallback.json", "");
        if (!allReports.some(r => r.__file && r.__file.includes(baseName))) {
          try {
            const data = JSON.parse(fs.readFileSync(full, "utf-8"));
            data.__file = rel;
            data.fallback = true;
            allReports.push(data);
          } catch (e) {
            allReports.push({
              job: rel,
              status: "failure",
              errors: 1,
              warnings: 0,
              messages: [{ type: "error", message: `Failed to parse fallback: ${e.message}` }]
            });
          }
        }
        continue;
      }

      processedFiles.push(`✔️ Summary: ${rel}`);
      try {
        const data = JSON.parse(fs.readFileSync(full, "utf-8"));
        data.__file = rel;
        const schemaError = validateSchema(full);
        if (schemaError) {
          data.schema_error = schemaError;
          if (data.status !== "missing") {
            data.status = "failure";
          }
        }
        allReports.push(data);
      } catch (e) {
        schemaFailures++;
        allReports.push({
          job: rel,
          status: "failure",
          errors: 1,
          warnings: 0,
          messages: [{ type: "error", message: `Failed to parse diagnostics: ${e.message}` }],
          schema_error: e.toString()
        });
      }
    }
  }

  loadFiles(baseDir);

  const expectedJobs = [
    "frontend-checks_lint",
    "frontend-checks_prettier",
    "frontend-checks_type-check",
    "frontend-checks_test-unit",
    "frontend-checks_playwright-e2e",
    "backend-checks_black",
    "backend-checks_flake8",
    "backend-checks_mypy",
    "backend-checks_pytest",
    "coverage-checks_frontend",
    "coverage-checks_backend",
    "coverage-checks_backend-node",
    "coverage-checks_e2e"
  ];

  const expectedSet = new Set(expectedJobs);
  const jobMap = new Map();
  const extras = [];

  for (const report of allReports) {
    if (report.job && expectedSet.has(report.job) && !jobMap.has(report.job)) {
      jobMap.set(report.job, report);
    } else {
      extras.push(report);
    }
  }

  const orderedReports = expectedJobs.map(job => {
    if (jobMap.has(job)) return jobMap.get(job);
    return {
      job,
      status: "missing",
      exit_code: null,
      errors: 0,
      warnings: 1,
      messages: [{ type: "warning", message: "No diagnostics JSON uploaded" }]
    };
  });

  const finalReports = [
    ...orderedReports,
    ...extras.filter(r => !expectedSet.has(r.job) || r.fallback)
  ];

  let totalErrors = 0;
  let totalWarnings = 0;
  const totalCoverageLines = { covered: 0, missed: 0 };

  let summaryTable = "### 📊 Summary Table\n\n| Job | Status | Exit Code | Schema Valid |\n|-----|--------|-----------|--------------|\n";
  let metadataTable = "\n### 🛠 Tool Metadata\n\n| Job | Tool | Version | Runner | OS |\n|-----|------|---------|--------|----|\n";

  let errorsSection = "\n### ❌ Consolidated Errors\n";
  let warningsSection = "\n### ⚠️ Consolidated Warnings\n";
  let failedTestsSection = "\n### 🧨 Consolidated Test Failures\n";
  const processedList = processedFiles.length ? processedFiles.join("\n") : "No summary files discovered.";
  const processedSection = "\n### 📂 Files Processed\n" + processedList;
  const appendWarning = message => {
    if (warningsSection.includes("_No warnings reported._")) {
      warningsSection = warningsSection.replace("_No warnings reported._", "").trimEnd();
    }
    if (!warningsSection.endsWith("\n")) {
      warningsSection += "\n";
    }
    warningsSection += `${message}\n`;
  };

  for (const r of finalReports) {
    const errors = Number.isInteger(r.errors)
      ? r.errors
      : (Array.isArray(r.errors) ? r.errors.length : 0);
    const warnings = Number.isInteger(r.warnings)
      ? r.warnings
      : (Array.isArray(r.warnings) ? r.warnings.length : 0);

    totalErrors += errors;
    totalWarnings += warnings;

    let exitCodeValue = null;
    if (typeof r.exit_code === "number") {
      exitCodeValue = r.exit_code;
    } else if (typeof r.exit_code === "string" && r.exit_code.trim() !== "" && !Number.isNaN(Number(r.exit_code))) {
      exitCodeValue = Number(r.exit_code);
    }
    const exitCodeDisplay = exitCodeValue ?? "?";

    let status = r.status || "?";
    if (r.schema_error) {
      status = "failure";
    } else if (exitCodeValue !== null && status !== "missing") {
      if (exitCodeValue !== 0 && status !== "failure") {
        status = "failure";
      }
      if (exitCodeValue === 0 && status === "?") {
        status = "success";
      }
    }

    summaryTable += `| ${r.job || r.__file || "unknown"} | ${status} | ${exitCodeDisplay} | ${r.schema_error ? "❌" : "✅"} |\n`;

    metadataTable += `| ${r.job || r.__file || "unknown"} | ${r.metadata?.tool || "?"} | ${r.metadata?.version || "?"} | ${r.environment?.runner || "?"} | ${r.environment?.os || "?"} |\n`;

    if (errors > 0) errorsSection += `- ${r.job || r.__file}: ${errors} errors reported\n`;
    if (warnings > 0) warningsSection += `- ${r.job || r.__file}: ${warnings} warnings reported\n`;
    if (r.tests && r.tests.some(t => t.status === "failed")) {
      r.tests.filter(t => t.status === "failed").forEach(t => {
        failedTestsSection += `- ${r.job || r.__file}: ${t.name} → ${t.message || "failed"}\n`;
      });
    }

    if (r.coverage && r.coverage.lines) {
      totalCoverageLines.covered += r.coverage.lines.covered || 0;
      totalCoverageLines.missed += r.coverage.lines.missed || 0;
    }
  }

  if (errorsSection.trim() === "### ❌ Consolidated Errors") errorsSection += "\n_No errors reported._\n";
  if (warningsSection.trim() === "### ⚠️ Consolidated Warnings") warningsSection += "\n_No warnings reported._\n";
  if (failedTestsSection.trim() === "### 🧨 Consolidated Test Failures") failedTestsSection += "\n_No test failures reported._\n";

  let coverageSection = "\n### 📊 Coverage Summary\n";
  if (totalCoverageLines.covered + totalCoverageLines.missed > 0) {
    const total = totalCoverageLines.covered + totalCoverageLines.missed;
    const overallPct = ((totalCoverageLines.covered / total) * 100).toFixed(2);
    coverageSection += `Overall Coverage: ${overallPct}% (${totalCoverageLines.covered}/${total} lines covered)\n`;
    if (Number(overallPct) < 70) {
      appendWarning(`⚠️ Coverage below threshold: ${overallPct}%`);
      process.exitCode = 1;
    }
  } else {
    coverageSection += "No coverage data found.\n";
  }

  const runUrl = process.env.GITHUB_RUN_ID && process.env.GITHUB_REPOSITORY
    ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : null;

  const reportOut = `## ⚠️ CI Diagnostics Report\n\n${summaryTable}\n${metadataTable}\n${errorsSection}\n${warningsSection}\n${failedTestsSection}\n${coverageSection}\n${processedSection}${runUrl ? `\n\n🔗 [View workflow run](${runUrl})` : ""}`;

  fs.writeFileSync(path.join(workspaceDir, "report.md"), reportOut);
  fs.writeFileSync(
    path.join(workspaceDir, "diagnostics-meta.json"),
    JSON.stringify(
      {
        totalErrors,
        totalWarnings,
        jobs: finalReports.length,
        schemaFailures,
        schemaPasses,
        coverage: totalCoverageLines
      },
      null,
      2
    )
  );
} catch (err) {
  const workspaceDir = process.env.GITHUB_WORKSPACE || process.cwd();
  fs.writeFileSync(path.join(workspaceDir, "report.md"), `## ⚠️ Diagnostics Aggregator Error\n\n${err.message}`);
  fs.writeFileSync(
    path.join(workspaceDir, "diagnostics-meta.json"),
    JSON.stringify({ totalErrors: 0, totalWarnings: 0, jobs: 0, schemaFailures: 1, schemaPasses: 0 }, null, 2)
  );
}
