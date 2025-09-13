import React, { useEffect, useState } from "react";
import TrendAlerts from "./components/TrendAlerts";
import CviGauge from "./components/CviGauge";
import HealthChart from "./components/HealthChart";
import CommitSelector from "./components/CommitSelector";
import ComparisonTable from "./components/ComparisonTable";

export interface HealthEntry {
  id: string;
  value: number;
  status: string;
  timestamp: string;
}

export default function CulturalHealthDashboard() {
  const [data, setData] = useState<HealthEntry[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<HealthEntry | null>(null);
  const [compareCommit, setCompareCommit] = useState<HealthEntry | null>(null);
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
      const json: HealthEntry[] = await res.json();
      const formatted: HealthEntry[] = json.map((entry) => ({
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