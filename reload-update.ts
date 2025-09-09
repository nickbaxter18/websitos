// reload-update.ts
// 🔄 Updates src/reload.ts with a fresh timestamp
// Run this script (via npm run reload) to force Vite hot reload.

import fs from "fs";
import path from "path";

function updateReloadFile() {
  const timestamp = new Date().toISOString();

  // ✅ Always write to src/reload.ts (absolute path based on project root)
  const reloadFile = path.join(process.cwd(), "src", "reload.ts");

  const content = `// 🔄 Reload Trigger File
// Last updated: ${timestamp}

export const lastReload = "${timestamp}";
`;

  fs.writeFileSync(reloadFile, content, "utf8");
  console.log(`✅ src/reload.ts updated at ${timestamp}`);
}

// Run immediately
updateReloadFile();
