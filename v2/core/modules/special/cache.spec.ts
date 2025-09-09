import { jest } from "@jest/globals";

// Mock Node core modules BEFORE requiring the file
jest.mock("os", () => ({
  homedir: jest.fn().mockReturnValue("/tmp"),
}));

jest.mock("path", () => ({
  resolve: jest.fn((...args) => args.join("/")),
}));

jest.mock("fs", () => ({
  existsSync: jest.fn().mockReturnValue(true),
  readFileSync: jest.fn().mockReturnValue("{}"),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

describe("cache module", () => {
  it("imports successfully", () => {
    const cache = require("./cache");
    expect(cache).toBeDefined();
  });
});
