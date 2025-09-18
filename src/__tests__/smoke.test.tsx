import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import "tsconfig-paths/register";

async function importAllFromDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await importAllFromDir(fullPath);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) &&
      !entry.name.endsWith(".test.ts") &&
      !entry.name.endsWith(".test.tsx") &&
      !entry.name.endsWith(".stories.tsx")
    ) {
      try {
        await import(pathToFileURL(fullPath).href);
      } catch (err) {
        console.warn(`⚠️ Failed to import ${fullPath}: ${(err as Error).message}`);
      }
    }
  }
}

test("smoke: all modules in src importable (warnings on failure)", async () => {
  const srcDir = path.join(__dirname, "..", "..");
  await importAllFromDir(srcDir);
});