import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders App shell", () => {
  render(<App />);
  // Look for a stable UI element like the navigation bar
  expect(screen.getByRole("navigation")).toBeInTheDocument();
});
