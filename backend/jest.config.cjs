module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"],
  transform: {},
  moduleFileExtensions: ["js", "json"],
  coverageDirectory: "../coverage/backend-node",
  collectCoverageFrom: ["**/*.js", "!**/node_modules/**"],
};
