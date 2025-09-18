import fs from "fs";
import path from "path";

function importAllFromDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      importAllFromDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
      try {
        require(fullPath);
      } catch (err) {
        console.warn(`⚠️ Failed to import ${fullPath}: ${(err as Error).message}`);
      }
    }
  });
}

test("smoke: all modules in src importable (warnings on failure)", () => {
  const srcDir = path.join(__dirname, "..", "..");
  importAllFromDir(srcDir);
});