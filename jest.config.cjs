module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.{js,ts}"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "src/__tests__/smoke.test.tsx" // 🚫 exclude smoke test from normal Jest runs
  ],
  coverageDirectory: "coverage/frontend",
  coverageReporters: ["lcov", "text", "json-summary", "cobertura"]
};