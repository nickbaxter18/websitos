module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/WEBSITEOS/v2/core/modules/special/__mocks__"],
  testPathIgnorePatterns: ["/node_modules/", "/tests/e2e/"],
};
