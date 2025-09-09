import { jest } from "@jest/globals";

// Mock semver before requiring file
jest.mock("semver", () => ({
  __esModule: true,
  gt: jest.fn().mockReturnValue(false),
}));

jest.mock("./cache", () => ({
  __esModule: true,
  getLastUpdate: jest.fn().mockReturnValue(Date.now()),
  saveLastUpdate: jest.fn(),
}));

jest.mock("./getDistVersion", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue("1.0.0"),
}));

describe("hasNewVersion", () => {
  it("loads without crashing", () => {
    const fn = require("./hasNewVersion").default;
    expect(fn).toBeDefined();
  });
});
