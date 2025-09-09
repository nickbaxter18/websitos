import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders Home route", () => {
  render(
    <MemoryRouter initialEntries={["/websitos"]}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/home/i)).toBeInTheDocument();
});
