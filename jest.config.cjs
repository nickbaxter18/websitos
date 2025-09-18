module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.{js,ts}",
    "!src/pages/**",
    "!src/__tests__/**"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "src/__tests__/smoke.test.tsx",
    "tests/e2e/",
    "dist/",
    "coverage/"
  ],
  setupFiles: ["<rootDir>/src/setupTests.ts"],
  coverageDirectory: "coverage/frontend",
  coverageReporters: ["lcov", "text", "json-summary", "cobertura"],
  passWithNoTests: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1' // ✅ resolve @ alias to src/
  }
};