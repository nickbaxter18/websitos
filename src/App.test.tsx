import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";

test("renders app without crashing", () => {
  render(<App />);
  // Look for any element that should be present in the default App
  expect(screen.getByText(/learn/i)).toBeInTheDocument();
});
