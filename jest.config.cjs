module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.{js,ts}"
  ],
  coverageDirectory: "coverage/frontend",
  coverageReporters: ["lcov", "text", "json-summary", "cobertura"]
};