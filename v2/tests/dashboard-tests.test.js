import { render, screen } from "@testing-library/react";
import HealthChart from "../dashboard/components/HealthChart";
import ComparisonTable from "../dashboard/components/ComparisonTable";

const mockCommits = [
  { diversity: 0.5, coherence: 0.6, resilience: 0.4, beauty: 0.3, cvi: 0.45 },
  { diversity: 0.6, coherence: 0.7, resilience: 0.5, beauty: 0.4, cvi: 0.55 },
];

describe("Dashboard Components", () => {
  test("renders HealthChart with data", () => {
    render(<HealthChart data={mockCommits} />);
    expect(screen.getByText(/diversity/i)).toBeInTheDocument();
  });

  test("renders ComparisonTable and shows deltas", () => {
    render(<ComparisonTable selectedCommit={mockCommits[1]} compareCommit={mockCommits[0]} />);
    expect(screen.getByText(/diversity/i)).toBeInTheDocument();
    expect(screen.getAllByText(/↑ 0.10/).length).toBeGreaterThan(0);
  });
});
