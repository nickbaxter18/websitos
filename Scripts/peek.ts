import { resolveAnchor } from "../ops/anchors";
import fs from "node:fs";

const file = process.argv[2];
const anchor = process.argv[3];
if (!file || !anchor) {
  console.error('Usage: ts-node -P tsconfig.ops.json scripts/peek.ts <file> "<anchor>"');
  process.exit(1);
}

const src = fs.readFileSync(file, "utf8");
const loc = resolveAnchor(src, anchor);
const windowStart = Math.max(0, loc.index - 200);
const windowEnd = Math.min(src.length, loc.index + 200);
const around = src.slice(windowStart, windowEnd);

console.log("index:", loc.index, "kind:", anchor.split(":")[0]);
console.log("---- around ----");
console.log(around);
console.log("---- /around ----");
