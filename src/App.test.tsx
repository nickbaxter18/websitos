import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders App without crashing (smoke test)", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  expect(true).toBe(true);
});
