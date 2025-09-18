export type QAStatus = "pass" | "warn" | "fail";
export type SecStatus = "safe" | "warn" | "block";
export type HarmonyDecision = "approved" | "blocked";
export type Profile = "Strict" | "Balanced" | "Fast";

export interface Budgets {
  perfMaxBundleKB: number;
  accessContrast: number;
  testsCoverage: number;
}

export interface EditCommand {
  type: "insert" | "replace" | "append" | "full-rewrite";
  file: string;
  anchors?: string[];
  payload?: string;
}

export interface EditorEntry {
  ts: string;
  file: string;
  mode: EditCommand["type"];
  anchors: string[];
  diff: string;
  confidence: number;
  rationale: string;
}

export interface QALog {
  summary: { status: QAStatus };
  syntax: { status: QAStatus; notes: string[] };
  tests: { coverage: number; status: "pass" | "fail"; notes: string[] };
  perf: { bundleKB: number; budgetKB: number; status: QAStatus };
  access: { contrastMin: number; budget: number; status: QAStatus };
  seo: { status: QAStatus; notes: string[] };
  governance: { licenseOk: boolean; status: QAStatus };
}

export interface SecLog {
  summary: { status: SecStatus };
  secrets: { found: string[]; status: "safe" | "block" };
  deps: { highOrCritical: string[]; status: SecStatus };
  configs: { issues: string[]; status: SecStatus };
  runtime: { https: boolean; headers: { csp: boolean; hsts: boolean }; status: SecStatus };
}

export interface HarmonyLog {
  cycleId: string;
  editor: { files: string[]; modes: string[] };
  qa: { status: QAStatus };
  sec: { status: SecStatus };
  decision: HarmonyDecision;
  reason: string;
}
