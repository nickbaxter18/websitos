import React from "react";

interface CommitSelectorProps {
  data: any[];
  selectedCommit: any | null;
  setSelectedCommit: (commit: any) => void;
  compareCommit: any | null;
  setCompareCommit: (commit: any) => void;
}

export default function CommitSelector({
  data,
  selectedCommit,
  setSelectedCommit,
  compareCommit,
  setCompareCommit,
}: CommitSelectorProps) {
  if (!data || data.length === 0) return <p className="text-gray-500">No commits available.</p>;

  return (
    <div className="mt-6 rounded-xl bg-gray-100 p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold">Commit Navigation</h2>
      <div className="flex flex-wrap gap-4">
        {/* Primary commit selector */}
        <select
          className="rounded border p-2 text-sm"
          value={selectedCommit?.commit || ""}
          onChange={(e) => {
            const commit = data.find((d) => d.commit === e.target.value);
            if (commit) setSelectedCommit(commit);
          }}
        >
          {data.map((entry) => (
            <option key={entry.commit} value={entry.commit}>
              {entry.timestamp} — {entry.commit.slice(0, 7)}
            </option>
          ))}
        </select>

        {/* Comparison commit selector */}
        {data.length > 1 && (
          <select
            className="rounded border p-2 text-sm"
            value={compareCommit?.commit || ""}
            onChange={(e) => {
              const commit = data.find((d) => d.commit === e.target.value);
              if (commit) setCompareCommit(commit);
            }}
          >
            <option value="">-- Compare with --</option>
            {data.map((entry) => (
              <option key={entry.commit} value={entry.commit}>
                {entry.timestamp} — {entry.commit.slice(0, 7)}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
