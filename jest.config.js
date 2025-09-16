import fs from "fs";
import path from "path";

// Load thresholds from central config
const configPath = path.resolve("./coverage.config.json");
let thresholds = {};
try {
  thresholds = JSON.parse(fs.readFileSync(configPath, "utf8")).thresholds;
} catch (e) {
  console.warn("⚠️ Could not load coverage.config.json, using defaults");
}

export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: [
    "<rootDir>/tests/e2e/", // skip Playwright tests during pre-push
    "<rootDir>/WEBSITEOS/", // skip legacy tests
  ],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^v2/(.*)$": "<rootDir>/v2/$1",
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  coverageThreshold: {
    global: {
      lines: thresholds.lines || 80,
      branches: thresholds.branches || 75,
      functions: thresholds.functions || 80,
      statements: thresholds.statements || 80,
    },
  },
};