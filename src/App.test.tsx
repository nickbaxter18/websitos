import { render } from "@testing-library/react";
import React from "react";
import App from "./App";

test("renders app without crashing (smoke test)", () => {
  render(<App />);
  // If render() did not throw, the test passes
  expect(true).toBe(true);
});
