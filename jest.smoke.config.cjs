module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/__tests__/smoke.test.tsx"],
  collectCoverage: true,
  errorOnDeprecated: false,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/v2/**",
    "!src/pages/Status.tsx",
    "!src/pages/Terms.tsx",
    "!src/reload.ts"
  ],
  coverageDirectory: "coverage/smoke",
  coverageReporters: ["lcov", "text-summary"],
};