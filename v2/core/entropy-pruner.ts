// v2/core/entropy-pruner.ts
import fs from "fs";
import path from "path";

interface PruneRecord {
  file: string;
  reason: string;
  action: "archived" | "deleted" | "merged";
  timestamp: string;
}

export class EntropyPruner {
  private logs: PruneRecord[] = [];
  private archiveDir = path.resolve("docs/meta/archive/");
  private pruneLog = path.resolve("docs/meta/pruned.md");

  constructor() {
    if (!fs.existsSync(this.archiveDir)) fs.mkdirSync(this.archiveDir, { recursive: true });
  }

  prune(file: string, reason: string, action: "archived" | "deleted" | "merged" = "archived") {
    const record: PruneRecord = {
      file,
      reason,
      action,
      timestamp: new Date().toISOString(),
    };

    if (fs.existsSync(file)) {
      if (action === "archived") {
        const baseName = path.basename(file);
        fs.renameSync(file, path.join(this.archiveDir, baseName));
      } else if (action === "deleted") {
        fs.unlinkSync(file);
      }
    }

    this.logs.push(record);
    this.logRecord(record);
  }

  private logRecord(record: PruneRecord) {
    const entry = `- ${record.timestamp}: ${record.file} → ${record.action} (reason: ${record.reason})\n`;
    fs.appendFileSync(this.pruneLog, entry);
  }

  summarize() {
    return this.logs;
  }

  autoDetectDuplicates(dir: string, patterns: string[] = ["Navbar", "Footer", "SEO"]) {
    const files = fs.readdirSync(dir);
    const groups: Record<string, string[]> = {};

    for (const f of files) {
      for (const pattern of patterns) {
        if (f.toLowerCase().includes(pattern.toLowerCase())) {
          groups[pattern] = groups[pattern] || [];
          groups[pattern].push(path.join(dir, f));
        }
      }
    }

    for (const [pattern, group] of Object.entries(groups)) {
      if (group.length > 1) {
        // Keep the newest, prune the rest
        const sorted = group.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
        const [keep, ...pruneTargets] = sorted;
        for (const file of pruneTargets) {
          this.prune(file, `duplicate of ${keep}`, "archived");
        }
      }
    }
  }
}

// Example runner
if (require.main === module) {
  const pruner = new EntropyPruner();

  // Auto-detect duplicates in partial templates
  pruner.autoDetectDuplicates("v2/templates/partials");

  console.log("Auto-detection entropy pruning complete.");
}
