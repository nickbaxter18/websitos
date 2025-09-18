import fs from "fs";
import path from "path";

function importAllFromDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      importAllFromDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
      require(fullPath);
    }
  });
}

test("all modules in src can be imported without crashing", () => {
  const srcDir = path.join(__dirname, "..", "..");
  importAllFromDir(srcDir);
});