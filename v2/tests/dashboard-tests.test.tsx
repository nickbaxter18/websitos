import React, { PropsWithChildren } from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "@/pages/Dashboard";

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: PropsWithChildren<Record<string, never>>) => (
    <div data-testid="health-chart">{children}</div>
  ),
  LineChart: () => <div>LineChart</div>,
  Line: () => <div>Line</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  Tooltip: () => <div>Tooltip</div>,
}));

describe("Dashboard", () => {
  it("renders the dashboard heading", () => {
    render(<Dashboard />);
    expect(screen.getByText(/System Status/i)).toBeInTheDocument();
  });

  it("renders the mocked health chart", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("health-chart")).toBeInTheDocument();
  });
});