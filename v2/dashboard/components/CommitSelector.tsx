import React from "react";
import { CommitMetrics } from "../types.js";

interface CommitSelectorProps {
  data: CommitMetrics[];
  selectedCommit: CommitMetrics | null;
  setSelectedCommit: (commit: CommitMetrics | null) => void;
  compareCommit: CommitMetrics | null;
  setCompareCommit: (commit: CommitMetrics | null) => void;
}

export default function CommitSelector({
  data,
  selectedCommit,
  setSelectedCommit,
  compareCommit,
  setCompareCommit,
}: CommitSelectorProps) {
  return (
    <div className="mt-6">
      <h2 className="mb-2 text-lg font-semibold">Select Commits</h2>
      <div className="flex gap-4">
        <select
          className="rounded border p-2"
          value={selectedCommit?.id ?? ""}
          onChange={(e) => {
            const commit = data.find((d) => d.id === e.target.value) || null;
            setSelectedCommit(commit);
          }}
        >
          <option value="">Select Primary Commit</option>
          {data.map((commit) => (
            <option key={commit.id} value={commit.id}>
              {commit.id} — {commit.timestamp}
            </option>
          ))}
        </select>

        <select
          className="rounded border p-2"
          value={compareCommit?.id ?? ""}
          onChange={(e) => {
            const commit = data.find((d) => d.id === e.target.value) || null;
            setCompareCommit(commit);
          }}
        >
          <option value="">Select Comparison Commit</option>
          {data.map((commit) => (
            <option key={commit.id} value={commit.id}>
              {commit.id} — {commit.timestamp}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
