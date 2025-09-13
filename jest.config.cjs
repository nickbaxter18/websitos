/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src", "<rootDir>/v2", "<rootDir>/tests", "<rootDir>/WEBSITEOS/tests"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^v2/(.*)$": "<rootDir>/v2/$1"
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  setupFilesAfterEnv: [
    "@testing-library/jest-dom",
    "<rootDir>/jest.setup.js"
  ],
  // ✅ Exclude Playwright e2e tests from Jest, they run via `npm run test:e2e`
  testPathIgnorePatterns: ["/node_modules/", "/tests/e2e/", "/WEBSITEOS/tests/e2e/"],
};