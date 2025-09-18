module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/__tests__/smoke.test.tsx"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coverageDirectory: "coverage/smoke",
  coverageReporters: ["lcov", "text-summary"],
};