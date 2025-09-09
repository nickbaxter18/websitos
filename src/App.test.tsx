import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders App shell without crashing", () => {
  render(<App />);
  // Look for a stable element always rendered in the shell (like Navbar)
  expect(screen.getByText(/navbar/i)).toBeInTheDocument();
});
