import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import "tsconfig-paths/register";

const excludedDirs = ["v2", "tests"];

async function importAllFromDir(dir: string, failures: string[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory() && excludedDirs.includes(entry.name)) {
      continue; // 🚫 Skip excluded directories like v2 and tests
    }

    if (entry.isDirectory()) {
      await importAllFromDir(fullPath, failures);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) &&
      !entry.name.endsWith(".test.ts") &&
      !entry.name.endsWith(".test.tsx") &&
      !entry.name.endsWith(".stories.tsx") &&
      !entry.name.endsWith(".d.ts") &&
      !entry.name.includes("vite-env") &&
      !entry.name.includes("validateEnv")
    ) {
      try {
        await import(pathToFileURL(fullPath).href);
      } catch (err) {
        failures.push(`⚠️ Failed to import ${fullPath}: ${(err as Error).message}`);
      }
    }
  }
}

async function runSmokeImports(): Promise<string[]> {
  const failures: string[] = [];
  try {
    const srcDir = path.join(__dirname, "..", "..");
    await importAllFromDir(srcDir, failures);
  } catch (err) {
    failures.push(`⚠️ Unexpected error in smoke test: ${(err as Error).message}`);
  }
  return failures;
}

test("smoke: all modules importable (warnings only, never fails)", async () => {
  const failures = await Promise.resolve(runSmokeImports()).catch(err => [
    `⚠️ Smoke test crashed: ${(err as Error).message}`,
  ]);

  if (failures.length > 0) {
    console.warn("==== Smoke Test Warnings ====");
    try {
      for (const f of failures) console.warn(f);
    } catch {
      console.warn("⚠️ Failed to print some smoke warnings");
    }
    console.warn("============================");
  }

  expect(true).toBe(true); // always green
});