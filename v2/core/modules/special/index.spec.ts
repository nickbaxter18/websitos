import { jest } from "@jest/globals";

// Mock ESM deps first
jest.mock("express", () => ({
  __esModule: true,
  default: jest.fn((_opts: any) => ({})),
}));

// Mock local modules
jest.mock("./hasNewVersion", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(false as unknown as any),
}));

jest.mock("./getDistVersion", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue("1.0.0" as unknown as any),
}));

jest.mock("./cache", () => ({
  __esModule: true,
  getLastUpdate: jest.fn(() => Date.now()),
}));

describe("index module", () => {
  it("loads without crashing", () => {
    const mod = require("./index");
    expect(mod).toBeDefined();
  });
});
