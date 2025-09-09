import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";

test("renders App component without crashing", () => {
  render(<App />);
  expect(screen.getByText(/react/i)).toBeInTheDocument();
});
