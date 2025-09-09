import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders App inside MemoryRouter with basename", () => {
  render(
    <MemoryRouter initialEntries={["/websitos"]}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByRole("navigation")).toBeInTheDocument();
});
