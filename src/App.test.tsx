import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders App without crashing", () => {
  render(<App />);
  // Adjusted test to look for actual visible text in the App
  expect(screen.getByText(/home/i)).toBeInTheDocument();
});
