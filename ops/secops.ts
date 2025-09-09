import { SecLog } from "./types";

export function secChecks(simulate: "none" | "secrets" | "cve" = "none"): SecLog {
  const base: SecLog = {
    summary: { status: "safe" },
    secrets: { found: [], status: "safe" },
    deps: { highOrCritical: [], status: "safe" },
    configs: { issues: [], status: "safe" },
    runtime: { https: true, headers: { csp: true, hsts: true }, status: "safe" },
  };
  if (simulate === "secrets") {
    base.secrets = { found: ["DEMO_SECRET=***"], status: "block" };
    base.summary.status = "block";
  }
  if (simulate === "cve") {
    base.deps = { highOrCritical: ["lodash@4.17.20 CVE-2020-8203"], status: "block" };
    base.summary.status = "block";
  }
  return base;
}