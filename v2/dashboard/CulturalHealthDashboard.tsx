import React, { useEffect, useState } from "react";
import TrendAlerts from "./components/TrendAlerts.js";
import CviGauge from "./components/CviGauge.js";
import HealthChart from "./components/HealthChart.js";
import CommitSelector from "./components/CommitSelector.js";
import ComparisonTable from "./components/ComparisonTable.js";
import { CommitMetrics, CommitMetricsNullable } from "./types.js";

export default function CulturalHealthDashboard() {
  const [data, setData] = useState<CommitMetrics[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<CommitMetricsNullable>(null);
  const [compareCommit, setCompareCommit] = useState<CommitMetricsNullable>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(fetchData, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  async function fetchData() {
    try {
      const res = await fetch("/docs/meta/health-history.json");
      const json: CommitMetrics[] = await res.json();
      const formatted: CommitMetrics[] = json.map((entry) => ({
        ...entry,
        timestamp: new Date(entry.timestamp).toLocaleString(),
      }));
      setData(formatted);
      setSelectedCommit(formatted[formatted.length - 1]);
    } catch {
      setData([]);
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">🌱 Cultural Health Dashboard</h1>

      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          Auto-refresh every 5s
        </label>
      </div>

      <TrendAlerts data={data} setAlerts={setAlerts} alerts={alerts} />
      <CviGauge selectedCommit={selectedCommit} />
      <HealthChart data={data} />

      <CommitSelector
        data={data}
        selectedCommit={selectedCommit}
        setSelectedCommit={setSelectedCommit}
        compareCommit={compareCommit}
        setCompareCommit={setCompareCommit}
      />

      <ComparisonTable
        selectedCommit={selectedCommit}
        compareCommit={compareCommit}
      />
    </div>
  );
}
