// v2/core/pipeline.ts — v3.1 Covenant Compliant (Fixed for Dotfiles)

import fs from "fs";
import path from "path";

const modulesDir = path.resolve("v2/core/modules/playbooks");
const logPath = path.resolve("docs/meta/gardening/runtime_log.md");
const healthPath = path.resolve("docs/meta/health.md");
const prunedPath = path.resolve("docs/meta/pruned.md");
const mythCyclesPath = path.resolve("docs/meta/myth_cycles.md");
const reconciliationsPath = path.resolve("docs/meta/reconciliations.md");
const sublimityPath = path.resolve("docs/meta/sublimity-index.md");

// Base + Extended schema from v3.1 Covenant
const required = [
  "id","function","dependencies","gardener_role",
  "archetype","myth_alignment","cultural_tags"
];
const extended = [
  "morphogenetics","quantum_light","material_poetry","ritual_navigation",
  "breath_cycles","dream_transitions","sensory_convergence",
  "ephemeral_rituals","collective_awe_gates","sublimity_index"
];

function validateModule(mod: any): boolean {
  return required.every(k => Object.prototype.hasOwnProperty.call(mod, k)) &&
         extended.every(k => Object.prototype.hasOwnProperty.call(mod, k));
}

// Helper: derive myths from modules
function extractMyth(mod: any): string {
  return `- Myth aligned with **${mod.myth_alignment}** → archetype: ${mod.archetype}`;
}

// Helper: create reconciliation treaties
function reconcile(mod: any): string {
  if (mod.gardener_role === "reconciler") {
    return `- Treaty: ${mod.id} reconciles diversity → coherence [${new Date().toISOString()}]`;
  }
  return "";
}

// Helper: sublimity scoring log
function sublimityScore(mod: any): string {
  if (mod.sublimity_index) {
    const s = mod.sublimity_index;
    return `- ${mod.id} → Harmony: ${s.harmony} | Resonance: ${s.resonance} | Awe: ${s.awe} | Transcendence: ${s.transcendence}`;
  }
  return `- ${mod.id} → Sublimity score missing`;
}

export function runPipeline(tenantActiveUsers: number = 0, phase: string = "dawn") {
  const files = fs.readdirSync(modulesDir);
  let validCount = 0, invalidCount = 0;
  const logEntries: string[] = [];
  const pruned: string[] = [];
  const mythUpdates: string[] = [];
  const treaties: string[] = [];
  const sublimityEntries: string[] = [];

  files.forEach(file => {
    // ✅ Skip hidden/dotfiles and junk
    if (file.startsWith(".")) return;
    if (!file.endsWith(".ts")) return;

    const mod = require(path.join(modulesDir, file));

    if (validateModule(mod)) {
      validCount++;
      const aweTriggered = tenantActiveUsers >= (mod.collective_awe_gates?.users || 100);

      logEntries.push(`[VALID] ${file} → role=${mod.gardener_role} | Phase=${phase} | AweTriggered=${aweTriggered}`);

      // Record myth cycle
      mythUpdates.push(extractMyth(mod));

      // Record reconciliation treaty
      const treaty = reconcile(mod);
      if (treaty) treaties.push(treaty);

      // Record sublimity index
      sublimityEntries.push(sublimityScore(mod));

    } else {
      invalidCount++;
      const closureNote = `- ${file} (schema non-compliant → archived with ritual closure at ${new Date().toISOString()})`;
      pruned.push(closureNote);

      const archiveDir = path.resolve("docs/meta/archive");
      fs.mkdirSync(archiveDir, {recursive: true});
      fs.renameSync(path.join(modulesDir, file), path.join(archiveDir, file));
    }
  });

  // Write logs
  fs.writeFileSync(logPath, logEntries.join("\n") + "\n", {flag:"a"});
  fs.writeFileSync(prunedPath, pruned.join("\n") + "\n", {flag:"a"});
  fs.writeFileSync(healthPath, `\nCycle: ${new Date().toISOString()} | Valid: ${validCount} | Pruned: ${invalidCount}`, {flag:"a"});

  // Write myth cycles
  if (mythUpdates.length > 0) {
    fs.writeFileSync(mythCyclesPath, `\n### Cycle ${new Date().toISOString()}\n${mythUpdates.join("\n")}\n`, {flag:"a"});
  }

  // Write reconciliations
  if (treaties.length > 0) {
    fs.writeFileSync(reconciliationsPath, `\n### Cycle ${new Date().toISOString()}\n${treaties.join("\n")}\n`, {flag:"a"});
  }

  // Write sublimity index entries
  if (sublimityEntries.length > 0) {
    fs.writeFileSync(sublimityPath, `\n### Cycle ${new Date().toISOString()}\n${sublimityEntries.join("\n")}\n`, {flag:"a"});
  }
}

// Run immediately if executed directly
if (require.main === module) {
  runPipeline();
}
