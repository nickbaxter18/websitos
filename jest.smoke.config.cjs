module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/__tests__/smoke.test.tsx"],
  collectCoverage: true,
  errorOnDeprecated: false,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/v2/**",
    "!src/pages/**", // 🚫 Exclude all pages, covered by E2E instead
    "!src/reload.ts",
    "!src/setupTests.ts",
  ],
  coverageDirectory: "coverage/smoke",
  coverageReporters: ["lcov", "text-summary"],
};
