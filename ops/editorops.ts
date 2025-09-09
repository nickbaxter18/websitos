import fs from "node:fs";
import { EditCommand, EditorEntry } from "./types";
import { resolveAnchor } from "./anchors";
import { readText, backupFile, writeText } from "./fileops";

function appendLedger(entry: EditorEntry) {
  const path = ".editor-diff-log.json";
  let cur: { entries: EditorEntry[] } = { entries: [] };
  try {
    cur = JSON.parse(fs.readFileSync(path, "utf8"));
  } catch {}
  if (!Array.isArray(cur.entries)) cur.entries = [];
  cur.entries.push(entry);
  fs.writeFileSync(path, JSON.stringify(cur, null, 2));
}

function escRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function stageAndApply(cmd: EditCommand): {
  entry: EditorEntry;
  before: string;
  after: string;
  backupPath?: string;
} {
  const before = readText(cmd.file);
  let after = before;

  const anchor = (cmd.anchors && cmd.anchors[0]) || "";

  if (cmd.type === "insert") {
    if (!anchor) throw new Error("insert requires an anchor");
    const loc = resolveAnchor(before, anchor);
    const insertLine = cmd.payload ?? "";
    const patchLine = insertLine + (insertLine.endsWith("\n") ? "" : "\n");

    // Idempotency: exact LINE match within a local window around the anchor
    const windowStart = Math.max(0, loc.index - 200);
    const windowEnd = Math.min(before.length, loc.index + 200);
    const around = before.slice(windowStart, windowEnd);
    const lineRe = new RegExp("^\\s*" + escRe(insertLine) + "\\s*$", "m");

    if (lineRe.test(around)) {
      after = before; // no-op (already present near anchor)
    } else {
      after = before.slice(0, loc.index) + patchLine + before.slice(loc.index);
    }
  } else if (cmd.type === "append") {
    const patch = "\n" + (cmd.payload ?? "");
    const patchLine = patch.endsWith("\n") ? patch : patch + "\n";
    if (!before.endsWith(patchLine)) {
      after = before + patchLine;
    }
  } else if (cmd.type === "replace") {
    if (!anchor) throw new Error("replace requires an anchor regex");
    const m = anchor.match(/^regex:\/(.+)\/([gimsuy]*)$/);
    if (!m) throw new Error("replace must use regex:/.../flags anchor");
    const re = new RegExp(m[1], m[2]);
    if (!re.test(before)) throw new Error("replace anchor not found");
    after = before.replace(re, cmd.payload ?? "");
  } else if (cmd.type === "full-rewrite") {
    after = cmd.payload ?? before;
  } else {
    throw new Error(`Unsupported edit type: ${cmd.type}`);
  }

  if (cmd.type !== "full-rewrite" && after.length < Math.floor(before.length * 0.5)) {
    throw new Error("Safety guard: after-content too small vs before-content; aborting");
  }

  if (after === before) {
    const entry: EditorEntry = {
      ts: new Date().toISOString(),
      file: cmd.file,
      mode: cmd.type,
      anchors: cmd.anchors ?? [],
      diff: "no-op (content unchanged)",
      confidence: 0.95,
      rationale: "Idempotent guard: exact line already present near anchor",
    };
    appendLedger(entry);
    return { entry, before, after };
  }

  const backupPath = backupFile(cmd.file);
  writeText(cmd.file, after);

  const entry: EditorEntry = {
    ts: new Date().toISOString(),
    file: cmd.file,
    mode: cmd.type,
    anchors: cmd.anchors ?? [],
    diff: computeDiffSummary(before, after),
    confidence: 0.9,
    rationale: "Applied safe-scoped edit with anchor resolution",
  };
  appendLedger(entry);
  return { entry, before, after, backupPath };
}

function computeDiffSummary(before: string, after: string): string {
  const b = before.split("\n").length;
  const a = after.split("\n").length;
  const delta = a - b;
  return delta === 0
    ? "lines unchanged (0)"
    : `lines ${b} -> ${a} (${delta > 0 ? "+" : ""}${delta})`;
}
