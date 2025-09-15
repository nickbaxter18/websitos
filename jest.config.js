export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: [
    "<rootDir>/tests/e2e/", // skip Playwright tests during pre-push
    "<rootDir>/WEBSITEOS/", // skip legacy tests
  ],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^v2/(.*)$": "<rootDir>/v2/$1",
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
};
