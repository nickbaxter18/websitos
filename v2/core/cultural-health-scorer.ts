// v2/core/cultural-health-scorer.ts
import fs from "fs";
import path from "path";

const HEALTH_FILE = path.resolve("docs/meta/health.md");
const HISTORY_FILE = path.resolve("docs/meta/health-history.json");

interface HealthMetrics {
  diversity: number; // -1 to +1
  coherence: number; // -1 to +1
  resilience: number; // -1 to +1
  beauty: number; // -1 to +1
}

interface HealthHistoryEntry extends HealthMetrics {
  timestamp: string;
  commit: string;
  branch: string;
}

// Diversity → based on number of modules/templates
function calcDiversity(): number {
  try {
    const modules = fs
      .readdirSync(path.resolve("v2/core/modules"))
      .filter((f) => f.endsWith(".ts")).length;
    const templates = fs
      .readdirSync(path.resolve("v2/templates/partials"))
      .filter((f) => f.endsWith(".tsx")).length;
    const score = Math.min(1, (modules + templates) / 50);
    return parseFloat(score.toFixed(2));
  } catch {
    return 0;
  }
}

// Coherence → based on schema validation logs
function calcCoherence(): number {
  try {
    const lineage = fs.readFileSync(path.resolve("docs/meta/lineage.md"), "utf-8");
    const violations = (lineage.match(/Schema violation/g) || []).length;
    const passes = (lineage.match(/passed schema validation/g) || []).length;
    if (passes + violations === 0) return 0;
    const score = passes / (passes + violations);
    return parseFloat((score * 2 - 1).toFixed(2));
  } catch {
    return 0;
  }
}

// Resilience → based on Jest coverage summary
function calcResilience(): number {
  try {
    const summary = fs.readFileSync(path.resolve("coverage/coverage-summary.json"), "utf-8");
    const data = JSON.parse(summary);
    const pct = data.total?.lines?.pct || 0;
    const score = Math.min(1, pct / 100);
    return parseFloat((score * 2 - 1).toFixed(2));
  } catch {
    return 0;
  }
}

// Beauty → based on lint + prettier logs
function calcBeauty(): number {
  try {
    const logs = fs.readFileSync(path.resolve("docs/meta/lineage.md"), "utf-8");
    const lintErrors = (logs.match(/error/g) || []).length;
    const lintPasses = (logs.match(/passed schema validation/g) || []).length;
    if (lintErrors + lintPasses === 0) return 0;
    const score = lintPasses / (lintPasses + lintErrors);
    return parseFloat((score * 2 - 1).toFixed(2));
  } catch {
    return 0;
  }
}

export function calculateHealth(): HealthMetrics {
  return {
    diversity: calcDiversity(),
    coherence: calcCoherence(),
    resilience: calcResilience(),
    beauty: calcBeauty(),
  };
}

export function logHealth(metrics: HealthMetrics) {
  const commitSha = process.env.GITHUB_SHA || "local-dev";
  const branch = process.env.GITHUB_REF || "local-branch";
  const timestamp = new Date().toISOString();

  const entry =
    `\n## Cultural Health Report: ${timestamp}\n` +
    `- Commit: ${commitSha}\n` +
    `- Branch: ${branch}\n` +
    `- Diversity: ${metrics.diversity}\n` +
    `- Coherence: ${metrics.coherence}\n` +
    `- Resilience: ${metrics.resilience}\n` +
    `- Beauty: ${metrics.beauty}\n`;
  fs.appendFileSync(HEALTH_FILE, entry);

  // Append to JSON history
  let history: HealthHistoryEntry[] = [];
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8"));
    } catch {
      history = [];
    }
  }
  history.push({ timestamp, commit: commitSha, branch, ...metrics });
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

// CLI runner for CI/CD
if (require.main === module) {
  console.log("🌱 Running cultural health scorer...");
  const metrics = calculateHealth();
  logHealth(metrics);
  console.log(
    "✅ Cultural health updated. See docs/meta/health.md and docs/meta/health-history.json"
  );
}
