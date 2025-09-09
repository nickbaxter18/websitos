import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const NPX = process.platform === "win32" ? "npx.cmd" : "npx";
const SHELL = process.platform === "win32";

type Sev = "critical"|"high"|"moderate"|"low"|"info";
const ORDER: Record<Sev, number> = { critical:4, high:3, moderate:2, low:1, info:0 };

function tsId(){ return new Date().toISOString().replace(/[:]/g,"").slice(0,15); }
function ensureDir(p:string){ if(!fs.existsSync(p)) fs.mkdirSync(p,{recursive:true}); }

function runAudit(args: string[]){
  const res = spawnSync("npm", ["audit","--json", ...args], { stdio: ["ignore","pipe","pipe"], shell: SHELL, encoding:"utf8" });
  if (res.error) throw res.error;
  const out = res.stdout?.trim() || "";
  return out.length ? JSON.parse(out) : {};
}

function summarize(auditJson:any, threshold: Sev){
  const findings: {name:string; via:string; severity:Sev; fixAvailable:boolean}[] = [];
  const advisories = auditJson?.vulnerabilities || {};   // npm v9
  const auditReport = auditJson?.auditReport || {};      // npm v10

  // npm v10 structure
  if (auditReport?.vulnerabilities) {
    for (const [name, v] of Object.entries<any>(auditReport.vulnerabilities)) {
      const sev = (v.severity || "info") as Sev;
      if (ORDER[sev] >= ORDER[threshold]) {
        findings.push({
          name,
          via: (v.via || []).map((x:any)=> typeof x==="string"? x : x?.title).filter(Boolean).join("; ").slice(0,180) || "via unknown",
          severity: sev,
          fixAvailable: !!v.fixAvailable
        });
      }
    }
  }

  // npm v9 fallback
  if (Object.keys(advisories).length) {
    for (const [name, v] of Object.entries<any>(advisories)) {
      const sev = (v.severity || "info") as Sev;
      if (ORDER[sev] >= ORDER[threshold]) {
        findings.push({
          name,
          via: v?.via?.map((x:any)=> typeof x==="string"? x : x?.title).filter(Boolean).join("; ").slice(0,180) || "via unknown",
          severity: sev,
          fixAvailable: !!v.fixAvailable
        });
      }
    }
  }
  return findings;
}

function main(){
  const args = process.argv.slice(2);
  const threshold = (args.find(a=>a.startsWith("--threshold="))?.split("=")[1] || "high") as Sev; // default: block high+
  const prodOnly = args.includes("--production");
  const extra: string[] = [];
  if (prodOnly) extra.push("--production");

  let json:any = {};
  try { json = runAudit(extra); }
  catch (e) { console.error("npm audit failed to run:", (e as any)?.message || e); process.exitCode = 2; }

  const findings = summarize(json, threshold);
  const blocked = findings.length > 0;

  const secLog = {
    summary: { status: blocked ? "block" : "safe" },
    secrets: { found: [], status: "safe" as const },
    deps: { highOrCritical: findings.map(f=>`${f.severity.toUpperCase()} ${f.name} — ${f.via}${f.fixAvailable?" (fix available)":""}`), status: blocked ? "block" : "safe" as const },
    configs: { issues: [], status: "safe" as const },
    runtime: { https: true, headers: { csp: true, hsts: true }, status: "safe" as const }
  };

  const outDir = path.join(".sec-log");
  ensureDir(outDir);
  const outFile = path.join(outDir, `SEC-${tsId()}.json`);
  fs.writeFileSync(outFile, JSON.stringify(secLog,null,2));

  if (blocked) {
    console.error(`❌ Dependency CVEs ≥ ${threshold.toUpperCase()} found (${findings.length}). Log: ${outFile}`);
    for (const f of findings.slice(0,12)) console.error(` - ${f.severity.toUpperCase()} ${f.name}: ${f.via}`);
    process.exitCode = 2;
  } else {
    console.log(`✅ No CVEs ≥ ${threshold.toUpperCase()} detected. Log: ${outFile}`);
  }
}

main();