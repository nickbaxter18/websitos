module.exports = {
  preset: "ts-jest/presets/js-with-babel",
  projects: [
    {
      displayName: "frontend",
      testEnvironment: "jsdom",
      testMatch: [
        "<rootDir>/src/**/*.test.{ts,tsx,js,jsx}",
        "<rootDir>/v2/tests/**/*.test.{ts,js}",
      ],
      setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
      transform: {
        "^.+\\.(ts|tsx|js|jsx|mjs)$": "ts-jest",
      },
    },
    {
      displayName: "backend",
      testEnvironment: "node",
      testMatch: ["<rootDir>/v2/core/**/*.spec.ts"],
      transform: {
        "^.+\\.(ts|tsx|js|jsx|mjs)$": "ts-jest",
      },
    },
  ],
};
