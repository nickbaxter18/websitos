import fs from "node:fs";
import path from "node:path";

export function readText(file: string): string {
  return fs.readFileSync(file, "utf8");
}

export function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

export function backupFile(file: string): string {
  const dir = path.join(".backup");
  ensureDir(dir);
  const ts = new Date().toISOString().replace(/[:]/g, "").replace(/\..+$/, "");
  const base = path.basename(file).replace(/[\\/:*?"<>|]/g, "_");
  const dest = path.join(dir, `${base}.${ts}`);
  fs.copyFileSync(file, dest);
  return dest;
}

export function writeText(file: string, content: string) {
  fs.writeFileSync(file, content, "utf8");
}
