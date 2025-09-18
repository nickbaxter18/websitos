const fs = require("fs");
const path = require("path");

// Walk through directories recursively
function walk(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      walk(filepath, callback);
    } else if (stat.isFile()) {
      callback(filepath);
    }
  });
}

// Convert identifiers with ., -, digits into safe PascalCase
function normalizeIdentifier(name) {
  // Special case: numeric-only identifiers like "2019"
  if (/^\d+$/.test(name)) {
    return "Schema" + name;
  }

  // Remove . and - and capitalize next letter
  return name
    .replace(/[\.\-]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ""))
    .replace(/^(.)/, (m) => m.toUpperCase());
}

// Fix schema files
function fixFile(filePath) {
  if (!filePath.endsWith(".ts")) return;

  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Match: export const Something = {
  content = content.replace(/export const ([A-Za-z0-9.\-]+)\s*=\s*{/g, (match, p1) => {
    const fixedName = normalizeIdentifier(p1);
    if (p1 !== fixedName) {
      console.log(`⚡ Fixing ${p1} → ${fixedName} in ${filePath}`);
      modified = true;
      return `export const ${fixedName} = {`;
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
  }
}

// Run on repo
walk(path.resolve(__dirname, "v2/core/modules"), fixFile);
