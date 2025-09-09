import path from "node:path";
import { DEFAULT_BUDGETS, DEFAULT_PROFILE } from "./config";
import { stageDiff } from "./editorops";
import { qaChecks } from "./qaops";
import { secChecks } from "./secops";
import { decide } from "./harmony";
import { runDevops } from "./devops";
import { writeQA, writeSEC, writeHarmony } from "./nexus";
import { EditCommand, HarmonyLog, Profile } from "./types";

export async function runCycle(
  cmd: EditCommand,
  opts?: { profile?: Profile; simulate?: "none" | "secrets" | "cve" | "access-fail" }
) {
  const profile = opts?.profile ?? DEFAULT_PROFILE;
  const simulate = opts?.simulate ?? "none";

  const { entry } = stageDiff(cmd);
  const qa = qaChecks(DEFAULT_BUDGETS, simulate === "access-fail" ? "access-fail" : "none");
  const sec = secChecks(simulate === "secrets" ? "secrets" : simulate === "cve" ? "cve" : "none");
  const { decision, reason } = decide(profile, qa, sec);
  const dev = runDevops(decision);

  const ts = new Date().toISOString().replace(/[:]/g, "").slice(0, 15);
  writeQA(path.join(".qa-log", `QA-${ts}.json`), qa);
  writeSEC(path.join(".sec-log", `SEC-${ts}.json`), sec);
  const harmony: HarmonyLog = {
    cycleId: `cycle-${ts}`,
    editor: { files: [entry.file], modes: [entry.mode] },
    qa: { status: qa.summary.status },
    sec: { status: sec.summary.status },
    decision,
    reason,
  };
  writeHarmony("harmony-log.json", harmony);

  return { qa, sec, decision, reason, dev };
}
