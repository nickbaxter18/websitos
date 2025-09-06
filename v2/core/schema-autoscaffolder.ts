// v2/core/schema-autoscaffolder.ts
import fs from "fs";
import path from "path";

const MODULES_DIR = path.resolve("v2/core/modules");
const LOG_FILE = path.resolve("docs/meta/lineage.md");

// Required schema fields
const REQUIRED_FIELDS = [
  "id",
  "function",
  "dependencies",
  "gardener_role",
  "archetype",
  "myth_alignment",
  "cultural_tags",
  "version",
  "scope",
  "ontology_forms",
  "apply",
  "fallback",
  "negotiate",
  "evolve",
  "coevolve",
  "cultivate",
];

function log(msg: string) {
  fs.appendFileSync(LOG_FILE, `- ${new Date().toISOString()} ${msg}\n`);
}

function ensureModuleCompliance(file: string) {
  try {
    const content = fs.readFileSync(file, "utf-8");

    // Check if the module already exports required fields
    let modified = false;
    let newContent = content;

    for (const field of REQUIRED_FIELDS) {
      if (!content.includes(field)) {
        modified = true;
        if (["apply", "fallback", "negotiate", "evolve", "coevolve", "cultivate"].includes(field)) {
          newContent += `\nexport async function ${field}() { console.log('${field}() not yet implemented in ${file}') }\n`;
        } else {
          newContent += `\nexport const ${field} = "TODO: fill ${field}"\n`;
        }
      }
    }

    if (modified) {
      fs.writeFileSync(file, newContent, "utf-8");
      log(`🛠 Auto-scaffolded missing fields in ${file}`);
    } else {
      log(`✅ ${file} already compliant`);
    }
  } catch (err) {
    log(`❌ Failed to auto-scaffold ${file}: ${(err as Error).message}`);
  }
}

function run() {
  if (!fs.existsSync(MODULES_DIR)) {
    console.error(`Modules directory not found: ${MODULES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(MODULES_DIR).filter((f) => f.endsWith(".ts"));
  for (const file of files) {
    const fullPath = path.join(MODULES_DIR, file);
    ensureModuleCompliance(fullPath);
  }

  console.log("✅ Auto-scaffolding complete. Check docs/meta/lineage.md for logs.");
}

if (require.main === module) {
  run();
}
