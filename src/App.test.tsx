import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders App shell without crashing", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
});
