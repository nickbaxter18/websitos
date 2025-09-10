import { jest } from "@jest/globals";

// Mock https and stream before requiring file
jest.mock("https", () => ({
  get: jest.fn((_url: unknown, cb: (res: unknown) => void) => {
    cb({ on: jest.fn(), pipe: jest.fn() });
    return { on: jest.fn() };
  }),
}));

jest.mock("stream", () => ({
  Writable: jest.fn() as unknown,
}));

describe("getDistVersion", () => {
  it("loads without crashing", () => {
    const mod = require("./getDistVersion");
    expect(mod).toBeDefined();
  });
});
