module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.{js,ts}",
    "!src/__tests__/**"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "src/__tests__/smoke.test.tsx"
  ],
  coverageDirectory: "coverage/frontend",
  coverageReporters: ["lcov", "text", "json-summary", "cobertura"],
  passWithNoTests: true // ✅ allow empty test suites without failing
};