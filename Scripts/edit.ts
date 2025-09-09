import { stageAndApply } from "../ops/editorops";

const args = process.argv;
const type = args[2] as "insert" | "append" | "replace" | "full-rewrite";
const file = args[3];
const anchor = args[4];             // e.g., before:CMD  | after:FROM  | regex:/pattern/flags
const payload = args[5];            // e.g., "USER node"  (for replace, provide full replacement text)

if (!type || !file) {
  console.error('Usage: ts-node -P tsconfig.ops.json scripts/edit.ts <insert|append|replace|full-rewrite> <file> "<anchor>" "<payload>"');
  process.exit(1);
}

try {
  const { entry, backupPath } = stageAndApply({ type, file, anchors: anchor ? [anchor] : [], payload });
  console.log("✅ Edit applied:", JSON.stringify(entry, null, 2));
  console.log("🛟 Backup:", backupPath);
} catch (e) {
  console.error("❌ Edit failed:", e instanceof Error ? e.message : e);
  process.exit(2);
}