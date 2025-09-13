import React from "react";
import { HealthEntry } from "../CulturalHealthDashboard";

interface CommitMetrics extends HealthEntry {
  diversity: number;
  coherence: number;
  resilience: number;
  beauty: number;
  cvi: number;
  commit: string;
}

interface ComparisonTableProps {
  selectedCommit: CommitMetrics | null;
  compareCommit: CommitMetrics | null;
}

export default function ComparisonTable({
  selectedCommit,
  compareCommit,
}: ComparisonTableProps) {
  if (!selectedCommit || !compareCommit) return null;

  function renderDelta(current: number, previous: number) {
    const diff = current - previous;
    const arrow = diff > 0 ? "↑" : diff < 0 ? "↓" : "→";
    const color =
      diff > 0
        ? "text-green-600"
        : diff < 0
        ? "text-red-600"
        : "text-gray-600";
    return <span className={color}>{`${arrow} ${diff.toFixed(2)}`}</span>;
  }

  function exportComparisonJSON() {
    const comparison = {
      from: compareCommit.commit,
      to: selectedCommit.commit,
      changes: {
        diversity: (
          selectedCommit.diversity - compareCommit.diversity
        ).toFixed(2),
        coherence: (
          selectedCommit.coherence - compareCommit.coherence
        ).toFixed(2),
        resilience: (
          selectedCommit.resilience - compareCommit.resilience
        ).toFixed(2),
        beauty: (selectedCommit.beauty - compareCommit.beauty).toFixed(2),
        cvi: (selectedCommit.cvi - compareCommit.cvi).toFixed(2),
      },
    };

    const blob = new Blob([JSON.stringify(comparison, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cultural-comparison-${compareCommit.commit.slice(
      0,
      7
    )}-to-${selectedCommit.commit.slice(0, 7)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportComparisonCSV() {
    const headers = ["Metric", "From", "To", "Change"];
    const rows = ["diversity", "coherence", "resilience", "beauty", "cvi"].map(
      (metric) => [
        metric,
        compareCommit[metric as keyof CommitMetrics].toFixed(2),
        selectedCommit[metric as keyof CommitMetrics].toFixed(2),
        (
          selectedCommit[metric as keyof CommitMetrics] -
          compareCommit[metric as keyof CommitMetrics]
        ).toFixed(2),
      ]
    );
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cultural-comparison-${compareCommit.commit.slice(
      0,
      7
    )}-to-${selectedCommit.commit.slice(0, 7)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-6 rounded-xl bg-blue-50 p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold">Comparison</h2>
      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2">Metric</th>
            <th className="p-2">From</th>
            <th className="p-2">To</th>
            <th className="p-2">Change</th>
          </tr>
        </thead>
        <tbody>
          {["diversity", "coherence", "resilience", "beauty", "cvi"].map(
            (metric) => (
              <tr key={metric}>
                <td className="p-2 capitalize">{metric}</td>
                <td className="p-2">
                  {compareCommit[metric as keyof CommitMetrics].toFixed(2)}
                </td>
                <td className="p-2">
                  {selectedCommit[metric as keyof CommitMetrics].toFixed(2)}
                </td>
                <td className="p-2">
                  {renderDelta(
                    selectedCommit[metric as keyof CommitMetrics],
                    compareCommit[metric as keyof CommitMetrics]
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <div className="mt-4 flex gap-2">
        <button
          onClick={exportComparisonJSON}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          ⬇️ Export as JSON
        </button>
        <button
          onClick={exportComparisonCSV}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          ⬇️ Export as CSV
        </button>
      </div>
    </div>
  );
}