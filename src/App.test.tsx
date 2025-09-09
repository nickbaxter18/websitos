import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders App route", () => {
  render(<App />);
  expect(screen.getByText(/home/i)).toBeInTheDocument();
});
