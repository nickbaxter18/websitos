import "@testing-library/jest-dom";
import React from "react";

// Polyfill ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

// Mock ResponsiveContainer without JSX
jest.mock("recharts", () => {
  const Original = jest.requireActual("recharts");
  return {
    ...Original,
    ResponsiveContainer: ({ children }: any) =>
      React.createElement("div", { style: { width: "800px", height: "400px" } }, children),
  };
});
