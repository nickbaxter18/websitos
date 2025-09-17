import fs from "fs";

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

export default {
  projects: [
    {
      displayName: "frontend",
      testEnvironment: "jsdom",
      coverageProvider: "v8",
      transform: {
        "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
      },
      extensionsToTreatAsEsm: [".ts", ".tsx"],
      moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
      testPathIgnorePatterns: [
        "<rootDir>/tests/simulations/autonomy.test.ts",
        "<rootDir>/tests/contract.test.ts",
        "<rootDir>/tests/e2e/",
        "<rootDir>/WEBSITEOS/",
        "<rootDir>/dist/",
        "<rootDir>/v2/",
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
        "!**/jest.config.js",
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
      testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      clearMocks: true,
      resetMocks: true,
      restoreMocks: true,
      testTimeout: 30000,
      watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
    },
    {
      displayName: "backend-js",
      testEnvironment: "node",
      coverageProvider: "v8",
      transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
      },
      moduleFileExtensions: ["js", "jsx", "json", "node"],
      collectCoverageFrom: [
        "backend/**/*.{js,jsx}",
        "!**/node_modules/**",
        "!**/dist/**",
        "!**/coverage/**",
      ],
      coverageThreshold: {
        global: {
          lines: config.backendJsThreshold,
          branches: config.backendJsThreshold,
          functions: config.backendJsThreshold,
          statements: config.backendJsThreshold,
        },
      },
      coverageReporters: ["text", "lcov", "json-summary", "cobertura"],
      coverageDirectory: "coverage/backend-js",
      testMatch: ["<rootDir>/backend/**/*.test.[jt]s?(x)"],
      clearMocks: true,
      resetMocks: true,
      restoreMocks: true,
      testTimeout: 30000,
    },
  ],
};
