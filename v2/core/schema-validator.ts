// v2/core/schema-validator.ts
import fs from "fs";
import path from "path";

// Design Genome required fields
const REQUIRED_FIELDS = [
  "id",
  "function",
  "dependencies",
  "gardener_role",
  "archetype",
  "myth_alignment",
  "cultural_tags",
];

const MODULES_DIR = path.resolve("v2/core/modules");
const LOG_FILE = path.resolve("docs/meta/lineage.md");

interface PlaybookModule {
  id: string;
  function?: string;
  fn?: string;
  dependencies: string[];
  gardener_role: string;
  archetype: string;
  myth_alignment: string;
  cultural_tags: string[];
  [key: string]: unknown;
}

function log(msg: string) {
  fs.appendFileSync(LOG_FILE, `- ${new Date().toISOString()} ${msg}\n`);
}

async function validateModule(filePath: string): Promise<boolean> {
  try {
    const modImport = await import(filePath);
    const mod: PlaybookModule = (modImport.default || modImport) as PlaybookModule;

    const missing = REQUIRED_FIELDS.filter((f) => {
      if (f === "function") {
        // accept either `function` or `fn`
        return !("function" in mod) && !("fn" in mod);
      }
      return !(f in mod);
    });

    if (missing.length > 0) {
      log(`❌ Schema violation in ${filePath} → missing fields: ${missing.join(", ")}`);
      return false;
    }

    log(`✅ ${filePath} passed schema validation`);
    return true;
  } catch (err) {
    log(`❌ Error validating ${filePath}: ${(err as Error).message}`);
    return false;
  }
}

export async function run() {
  if (!fs.existsSync(MODULES_DIR)) {
    console.error(`Modules directory not found: ${MODULES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(MODULES_DIR).filter((f) => f.endsWith(".ts"));

  let allPassed = true;
  for (const file of files) {
    const fullPath = path.join(MODULES_DIR, file);
    const ok = await validateModule(fullPath);
    if (!ok) allPassed = false;
  }

  if (!allPassed) {
    console.error("❌ Schema validation failed. Check docs/meta/lineage.md for details.");
    process.exit(1);
  } else {
    console.log("✅ All modules passed schema validation.");
  }
}

if (require.main === module) {
  run();
}
