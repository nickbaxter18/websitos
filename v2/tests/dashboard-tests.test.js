import { render, screen } from "@testing-library/react";
import React from "react";

// Expanded recharts mock
jest.mock("recharts", () => {
  return {
    ResponsiveContainer: ({ children }) => <div data-testid="health-chart">{children}</div>,
    LineChart: ({ children }) => <div>{children}</div>,
    Line: () => <div>Line</div>,
    XAxis: () => <div>XAxis</div>,
    YAxis: () => <div>YAxis</div>,
    Tooltip: () => <div>Tooltip</div>,
    Legend: () => <div>Legend</div>,
    CartesianGrid: () => <div>CartesianGrid</div>,
    ReferenceArea: () => <div>ReferenceArea</div>,
  };
});

import HealthChart from "../dashboard/components/HealthChart";
import ComparisonTable from "../dashboard/components/ComparisonTable";

const mockCommits = [
  { date: "2025-01-01", diversity: 0.5, cohesion: 0.7 },
  { date: "2025-01-02", diversity: 0.6, cohesion: 0.8 },
];

describe("Dashboard Components", () => {
  it("renders HealthChart with data", () => {
    render(<HealthChart data={mockCommits} />);
    expect(screen.getByTestId("health-chart")).toBeInTheDocument();
  });

  it("renders ComparisonTable", () => {
    render(<ComparisonTable commits={mockCommits} />);
    // Look for a cell containing 'diversity' value instead of header text
    expect(screen.getByText(/0.5/i)).toBeInTheDocument();
  });
});
