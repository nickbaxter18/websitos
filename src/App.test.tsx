import { render } from "@testing-library/react";
import React from "react";
import App from "./App";

test("renders App shell without crashing", () => {
  render(<App />);
});