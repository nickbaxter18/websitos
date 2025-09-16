import { render } from "@testing-library/react";
import React from "react";
import App from "./App";

test("renders App without crashing (smoke test)", () => {
  render(<App />);
  expect(true).toBe(true);
});