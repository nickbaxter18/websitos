import { jest } from "@jest/globals";

// Mock semver before requiring file
jest.mock("semver", () => ({
  __esModule: true,
  gt: jest.fn((_a: unknown, _b: unknown) => false),
}));

jest.mock("./cache", () => ({
  __esModule: true,
  getLastUpdate: jest.fn(() => Date.now()),
  saveLastUpdate: jest.fn(),
}));

jest.mock("./getDistVersion", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue("1.0.0" as unknown),
}));

describe("hasNewVersion", () => {
  it("loads without crashing", () => {
    const fn = require("./hasNewVersion").default;
    expect(fn).toBeDefined();
  });
});