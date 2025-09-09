import { HarmonyDecision, Profile, QALog, SecLog } from "./types";

export function decide(profile: Profile, qa: QALog, sec: SecLog): { decision: HarmonyDecision; reason: string } {
  const qaFail = qa.summary.status === "fail";
  const secBlock = sec.summary.status === "block";
  if (secBlock) return { decision: "blocked", reason: "SecOps block" };
  if (qaFail) return { decision: "blocked", reason: "QA fail" };
  if (profile === "Strict" && (qa.summary.status === "warn" || sec.summary.status === "warn"))
    return { decision: "blocked", reason: "Strict profile blocks on warnings" };
  return { decision: "approved", reason: "All gates green" };
}