import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const tsIso = new Date().toISOString();
const ts = tsIso.replace(/[:]/g, "").slice(0, 15);

const p = {
  diffLog: path.join(root, ".editor-diff-log.json"),
  qa: path.join(root, ".qa-log", `QA-${ts}.json`),
  sec: path.join(root, ".sec-log", `SEC-${ts}.json`),
  dev: path.join(root, ".devops-log", `DEV-${ts}.json`),
  harmony: path.join(root, "harmony-log.json"),
  opsHarmony: path.join(root, ".ops-harmony-log.json"),
  nexus: path.join(root, ".nexus-log.json"),
};

function ensureDirs() {
  for (const d of [".qa-log", ".sec-log", ".devops-log"]) {
    const dir = path.join(root, d);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  }
}
function readJSON(fp, fallback) { try { return JSON.parse(fs.readFileSync(fp,"utf8")); } catch { return fallback; } }
function writeJSON(fp, obj) { fs.writeFileSync(fp, JSON.stringify(obj, null, 2)); }
function appendDiff(entry) {
  let cur = readJSON(p.diffLog, null);
  if (!cur || typeof cur !== "object" || !Array.isArray(cur.entries)) cur = { entries: [] };
  cur.entries.push(entry);
  writeJSON(p.diffLog, cur);
}
function argFlag(name) {
  return process.argv.some(a => a.toLowerCase() === `--${name}` || a.toLowerCase() === `-${name[0]}`);
}
function argValue(name, dflt) {
  const i = process.argv.findIndex(a => a.toLowerCase().startsWith(`--${name}=`));
  if (i >= 0) return process.argv[i].split("=")[1];
  return dflt;
}

ensureDirs();

// CLI
// node scripts/opsCycle.mjs insert Dockerfile "before:CMD" "USER node" --profile=Balanced --simulate=none
const [, , type, file, anchor, payload] = process.argv;
const profile = (argValue("profile", process.env.OPS_PROFILE || "Balanced") || "Balanced").trim();
const simulate = (argValue("simulate", "none") || "none").trim(); // none|secrets|access-fail|cve
if (!type || !file) {
  console.error('Usage: node scripts/opsCycle.mjs <insert|replace|append> <file> "<anchor>" "<payload>" [--profile=Strict|Balanced|Fast] [--simulate=none|secrets|access-fail|cve]');
  process.exit(1);
}

// Stage diff
appendDiff({
  ts: tsIso,
  file,
  mode: type,
  anchors: anchor ? [anchor] : [],
  diff: `+ ${payload ?? ""}\n`,
  confidence: 0.86,
  rationale: "Simulated cycle",
});

// QA defaults (green)
let qa = {
  summary: { status: "pass" },
  syntax: { status: "pass", notes: [] },
  tests: { coverage: 0, status: "pass", notes: [] },
  perf: { bundleKB: 0, budgetKB: 200, status: "pass" },
  access: { contrastMin: 4.8, budget: 4.5, status: "pass" },
  seo: { status: "pass", notes: [] },
  governance: { licenseOk: true, status: "pass" },
};

// Sec defaults (green)
let sec = {
  summary: { status: "safe" },
  secrets: { found: [], status: "safe" },
  deps: { highOrCritical: [], status: "safe" },
  configs: { issues: [], status: "safe" },
  runtime: { https: true, headers: { csp: true, hsts: true }, status: "safe" },
};

// Simulations
if (simulate === "secrets") {
  sec.secrets = { found: ["OPENAI_API_KEY=***"], status: "block" };
  sec.summary.status = "block";
}
if (simulate === "cve") {
  sec.deps = { highOrCritical: ["lodash@4.17.20 CVE-2020-8203"], status: "block" };
  sec.summary.status = "block";
}
if (simulate === "access-fail") {
  qa.access = { contrastMin: 3.2, budget: 4.5, status: "fail" };
  qa.summary.status = "fail";
}

writeJSON(p.qa, qa);
writeJSON(p.sec, sec);

// Harmony decision
function isWarnLike(x){ return x === "warn"; }
function qaFail() { return qa.summary.status === "fail"; }
function secBlock() { return sec.summary.status === "block"; }

let decision = "approved";
let reason = "All gates green.";
if (secBlock()) { decision = "blocked"; reason = "SecOps block."; }
else if (qaFail()) { decision = "blocked"; reason = "QA fail."; }
else if (profile === "Strict" && (isWarnLike(qa.summary.status) || isWarnLike(sec.summary.status))) {
  decision = "blocked"; reason = "Strict profile blocks on warnings.";
}

const harmony = {
  cycleId: `cycle-${ts}`,
  editor: { files: [file], modes: [type] },
  qa: { status: qa.summary.status },
  sec: { status: sec.summary.status },
  decision,
  reason,
};
writeJSON(p.harmony, harmony);

// DevOps
let dev;
if (decision !== "approved") {
  dev = { build: { status: "skipped", durationSec: 0 }, container: { scan: "skipped", cves: [] }, deploy: { status: "skipped", strategy: "standard" }, monitor: { health: "ok" } };
} else {
  dev = { build: { status: "pass", durationSec: 12 }, container: { scan: "pass", cves: [] }, deploy: { status: "success", strategy: "canary" }, monitor: { health: "ok" } };
}
writeJSON(p.dev, dev);
writeJSON(p.opsHarmony, { editor: harmony.editor, qa: harmony.qa, sec: harmony.sec, dev: { build: dev.build.status, deploy: dev.deploy.status }, decision, reason });
writeJSON(p.nexus, { editor: harmony.editor, qa: harmony.qa, sec: harmony.sec, dev: { summary: dev.deploy.status }, arch: {}, front: {}, back: {}, know: {}, summary: `Cycle ${harmony.cycleId}: ${decision}.` });

console.log(`OpsCycle complete → decision: ${decision} (${reason}) [profile=${profile}, simulate=${simulate}]`);
if (decision !== "approved") process.exitCode = 2; // non-zero for CI hooks
