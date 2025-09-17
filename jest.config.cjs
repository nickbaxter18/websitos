const fs = require("fs");

let config = {
  globalThreshold: 80,
  frontendThreshold: 80,
  backendThreshold: 90,
  backendJsThreshold: 80,
  e2eThreshold: 70,
};

try {
  const file = fs.readFileSync("./coverage.config.json", "utf-8");
  if (file) {
    config = JSON.parse(file);
  }
} catch (e) {
  console.warn("⚠️ Using default coverage thresholds (coverage.config.json missing or invalid)");
}

module.exports = {
  projects: [
    {
      displayName: "frontend",
      testEnvironment: "jsdom",
      transform: {
        "^.+\\.[tj]sx?$": ["babel-jest", { configFile: "./.babelrc.js" }],
      },
      extensionsToTreatAsEsm: [".ts", ".tsx"],
      moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
      testPathIgnorePatterns: [
        "<rootDir>/dist/",
        "<rootDir>/coverage/",
        "<rootDir>/WEBSITEOS/",
        "<rootDir>/backend/"
      ],
      setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "\\.(css|less|scss)$": "identity-obj-proxy",
      },
      collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!**/node_modules/**",
        "!**/dist/**",
        "!**/coverage/**",
        "!**/*.d.ts",
        "!**/jest.config.cjs",
        "!**/babel.config.js",
      ],
      coverageThreshold: {
        global: {
          lines: config.frontendThreshold,
          branches: config.frontendThreshold,
          functions: config.frontendThreshold,
          statements: config.frontendThreshold,
        },
      },
      coverageReporters: ["text", "lcov", "json-summary", "cobertura"],
      coverageDirectory: "coverage/frontend",
      testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[jt]s?(x)"
      ],
      clearMocks: true,
      resetMocks: true,
      restoreMocks: true,
    },
  ],
};