import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders App shell without crashing", () => {
  render(
    <MemoryRouter initialEntries={["/websitos"]}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/System Status/i)).toBeInTheDocument();
});
