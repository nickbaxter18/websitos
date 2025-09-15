import { QALog, Budgets } from "./types.js";

export function qaChecks(budgets: Budgets, simulate: "none" | "access-fail" = "none"): QALog {
  const base: QALog = {
    summary: { status: "pass" },
    syntax: { status: "pass", notes: [] },
    tests: { coverage: budgets.testsCoverage, status: "pass", notes: [] },
    perf: { bundleKB: 0, budgetKB: budgets.perfMaxBundleKB, status: "pass" },
    access: {
      contrastMin: budgets.accessContrast + 0.3,
      budget: budgets.accessContrast,
      status: "pass",
    },
    seo: { status: "pass", notes: [] },
    governance: { licenseOk: true, status: "pass" },
  };
  if (simulate === "access-fail") {
    base.access = { contrastMin: 3.2, budget: budgets.accessContrast, status: "fail" };
    base.summary.status = "fail";
  }
  return base;
}