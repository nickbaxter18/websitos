const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const NPX = process.platform === "win32" ? "npx.cmd" : "npx";
const SHELL = process.platform === "win32"; // helps npx on Windows

function tsId(){ return new Date().toISOString().replace(/[:]/g,"").slice(0,15); }
function ensureDir(p){ if(!fs.existsSync(p)) fs.mkdirSync(p,{recursive:true}); }
function run(cmd, args, opts={}){
  console.log(`\n→ ${cmd} ${args.join(" ")}`);
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: SHELL, ...opts });
  const code = res.status ?? 0;
  console.log(`← exit ${code}`);
  return code;
}
function newestLog(dir, prefix){
  try{
    const files = fs.readdirSync(dir).filter(f=>f.startsWith(prefix)).map(f=>path.join(dir,f));
    if(!files.length) return null;
    files.sort((a,b)=>fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
    return files[0];
  }catch{ return null; }
}

function main(){
  const args = process.argv.slice(2);
  const [type, file, anchor, payload] = args;
  const project  = (args.find(a=>a.startsWith("--project="))?.split("=")[1]) || "tsconfig.json";
  const qaDir    = (args.find(a=>a.startsWith("--qadir="))?.split("=")[1])   || ".";
  const secDir   = (args.find(a=>a.startsWith("--secdir="))?.split("=")[1])  || ".";
  const qaLimit  = (args.find(a=>a.startsWith("--qalimit="))?.split("=")[1]) || "4000";
  const secLimit = (args.find(a=>a.startsWith("--seclimit="))?.split("=")[1])|| "4000";

  if (!type || !file) {
    console.error('Usage: node scripts/opsOrchestrate.cjs <insert|replace|append|full-rewrite> <file> "<anchor>" "<payload>" [--project=tsconfig.json] [--qadir=.] [--secdir=.] [--qalimit=4000] [--seclimit=4000]');
    process.exit(1);
  }

  console.log("== EditorOps :: applying edit ==");
  const editArgs = ["ts-node","-T","-P","tsconfig.ops.json","scripts/edit.ts", type, file];
  if (anchor) editArgs.push(anchor);
  if (payload) editArgs.push(payload);
  const editStatus = run(NPX, editArgs);
  console.log("== EditorOps :: done ==");

  console.log("== QAOps :: running ==");
  ensureDir(path.join(qaDir, ".qa-log"));
  const qaStatus = run(NPX, ["ts-node","-T","-P","tsconfig.ops.json","scripts/qa-check.ts", `--dir=${qaDir}`, `--project=${project}`, `--limit=${qaLimit}`]);
  console.log("== QAOps :: done ==");

  console.log("== SecOps (Secrets) :: running ==");
  ensureDir(path.join(secDir, ".sec-log"));
  const secStatus = run(NPX, ["ts-node","-T","-P","tsconfig.ops.json","scripts/scan-secrets.ts", `--dir=${secDir}`, `--limit=${secLimit}`]);
  console.log("== SecOps (Secrets) :: done ==");

  console.log("== SecOps (Deps/CVEs) :: running ==");
  const cveStatus = run(NPX, ["ts-node","-T","-P","tsconfig.ops.json","scripts/scan-deps.ts","--threshold=high"]);
  console.log("== SecOps (Deps/CVEs) :: done ==");

  // Decision
  let decision = "approved";
  let reason   = "All gates green.";
  if (editStatus !== 0)              { decision = "blocked"; reason = "EditorOps failed."; }
  else if (qaStatus !== 0)           { decision = "blocked"; reason = "QA fail."; }
  else if (secStatus !== 0)          { decision = "blocked"; reason = "SecOps (secrets) block."; }
  else if (cveStatus !== 0)          { decision = "blocked"; reason = "Dependency CVEs."; }

  // Harmony log
  const harmony = {
    cycleId: `cycle-${tsId()}`,
    editor: { files: [file], modes: [type] },
    qa:  { status: qaStatus  === 0 ? "pass" : "fail" },
    sec: { status: (secStatus===0 && cveStatus===0) ? "safe" : "block" },
    decision, reason
  };
  fs.writeFileSync("harmony-log.json", JSON.stringify(harmony, null, 2));

  const qaLogPath  = newestLog(path.join(qaDir,".qa-log"), "QA-")  || "(none)";
  const secLogPath = newestLog(path.join(secDir,".sec-log"), "SEC-")|| "(none)";

  console.log(`\n=== Decision: ${decision.toUpperCase()} — ${reason} ===`);
  console.log(`QA log:  ${qaLogPath}`);
  console.log(`SEC log: ${secLogPath}`);

  if (decision !== "approved") process.exitCode = 2;
}

main();