import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import App from "./App";

test("renders App shell without crashing", () => {
  render(
    <MemoryRouter initialEntries={["/websitos"]}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByRole("navigation")).toBeInTheDocument();
});
