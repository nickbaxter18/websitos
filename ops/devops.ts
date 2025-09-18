export interface DevReport {
  build: { status: "pass" | "fail" | "skipped"; durationSec: number };
  container: { scan: "pass" | "fail" | "skipped"; cves: string[] };
  deploy: {
    status: "success" | "rollback" | "skipped";
    strategy: "canary" | "bluegreen" | "standard";
  };
  monitor: { health: "ok" | "degraded" | "down" };
}

export function runDevops(decision: "approved" | "blocked"): DevReport {
  if (decision !== "approved")
    return {
      build: { status: "skipped", durationSec: 0 },
      container: { scan: "skipped", cves: [] },
      deploy: { status: "skipped", strategy: "standard" },
      monitor: { health: "ok" },
    };
  return {
    build: { status: "pass", durationSec: 12 },
    container: { scan: "pass", cves: [] },
    deploy: { status: "success", strategy: "canary" },
    monitor: { health: "ok" },
  };
}
