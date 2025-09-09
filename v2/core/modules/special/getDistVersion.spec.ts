import { jest } from "@jest/globals";

// Mock https and stream before requiring file
jest.mock("https", () => ({
  get: jest.fn((_url, cb) => {
    cb({ on: jest.fn(), pipe: jest.fn() });
    return { on: jest.fn() };
  }),
}));

jest.mock("stream", () => ({
  Writable: jest.fn(),
}));

describe("getDistVersion", () => {
  it("loads without crashing", () => {
    const mod = require("./getDistVersion");
    expect(mod).toBeDefined();
  });
});
