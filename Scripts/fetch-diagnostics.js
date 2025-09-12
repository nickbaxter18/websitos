#!/usr/bin/env node

// Fetch and parse latest Preflight diagnostics artifact from GitHub
const https = require('https');
const fs = require('fs');
const { execSync } = require('child_process');
const AdmZip = require('adm-zip');

const owner = "nickbaxter18";
const repo = "websitos";
const workflow = "ci-preflight.yml";
const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN;

if (!token) {
  console.error("❌ Missing GitHub token (set GITHUB_TOKEN or NEXT_PUBLIC_GITHUB_TOKEN)");
  process.exit(1);
}

function fetchJSON(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path,
      method: "GET",
      headers: {
        "User-Agent": "diagnostic-fetcher",
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json"
      }
    };
    
    const req = https.request(options, res => {
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    });
    
    req.on("error", reject);
    req.end();
  });
}

function fetchFile(url, dest) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent": "diagnostic-fetcher",
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json"
      }
    };
    https.get(url, options, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`Download failed: ${res.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", reject);
  });
}

(async () => {
  try {
    // 1. Get latest run ID
    const runs = await fetchJSON(`/repos/${owner}/${repo}/actions/workflows/${workflow}/runs?per_page=1`);
    const run = runs.workflow_runs?.[0];
    if (!run) throw new Error("No workflow runs found");

    console.log(`ℹ️ Latest Preflight run: #${run.id}, status=${run.status}, conclusion=${run.conclusion}`);

    // 2. Get artifacts for this run
    const artifacts = await fetchJSON(`/repos/${owner}/${repo}/actions/runs/${run.id}/artifacts`);
    const diag = artifacts.artifacts.find(a => a.name === "preflight-diagnostics");
    if (!diag) throw new Error("No preflight-diagnostics artifact found yet");

    console.log(`ℹ️ Found diagnostics artifact: id=${diag.id}, size=${diag.size_in_bytes} bytes`);

    // 3. Download artifact zip
    const zipPath = "/tmp/preflight-diagnostics.zip";
    await fetchFile(diag.archive_download_url, zipPath);

    // 4. Extract diagnostics.json
    const zip = new AdmZip(zipPath);
    const entry = zip.getEntry("diagnostics.json");
    if (!entry) throw new Error("diagnostics.json not found in artifact");
    const content = zip.readAsText(entry);
    const data = JSON.parse(content);

    // 5. Narrator-style summary
    console.log("\n--- 📝 Preflight Diagnostics Summary ---");
    console.log(`❌ Lint Errors: ${data.lint_errors}`);
    console.log(`❌ TypeScript Errors: ${data.ts_errors}`);
    console.log(`❌ Python Errors: ${data.python_errors}`);
    console.log(`❌ Jest Failures: ${data.jest_failures}`);
    console.log(`❌ Pytest Failures: ${data.pytest_failures}`);
    console.log("--------------------------------------\n");

  } catch (err) {
    console.error("❌ Error fetching diagnostics:", err.message);
    process.exit(1);
  }
})();