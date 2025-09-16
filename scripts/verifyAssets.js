import fs from "fs";
import path from "path";

const distDir = path.resolve("dist");
const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("❌ dist/index.html is missing");
  process.exit(1);
}

const indexContent = fs.readFileSync(indexPath, "utf-8");
if (!indexContent.trim()) {
  console.error("❌ dist/index.html is empty");
  process.exit(1);
}

console.log("✅ index.html exists and is not empty");

const assetRegex = /\/(assets\/[^"]+)/g;
const matches = [...indexContent.matchAll(assetRegex)];

let allGood = true;
matches.forEach((m) => {
  const assetPath = path.join(distDir, m[1]);
  if (!fs.existsSync(assetPath)) {
    console.error(`❌ Missing asset: ${m[1]}`);
    allGood = false;
  } else {
    console.log(`✅ Found asset: ${m[1]}`);
  }
});

if (!allGood) {
  process.exit(1);
}

console.log("🎉 All assets verified successfully");