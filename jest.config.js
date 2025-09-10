module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/tests/e2e/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^v2/(.*)$": "<rootDir>/v2/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
