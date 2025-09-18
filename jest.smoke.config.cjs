module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/__tests__/smoke.test.tsx"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/v2/**" // 🚫 Exclude legacy v2 folder
  ],
  coverageDirectory: "coverage/smoke",
  coverageReporters: ["lcov", "text-summary"],
};