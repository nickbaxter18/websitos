import React, { useEffect } from "react";

interface TrendAlertsProps {
  data: any[];
  alerts: string[];
  setAlerts: (alerts: string[]) => void;
}

export default function TrendAlerts({ data, alerts, setAlerts }: TrendAlertsProps) {
  useEffect(() => {
    if (data.length < 2) return;

    const newAlerts: string[] = [];
    const last = data[data.length - 1];
    const prev = data[data.length - 2];
    const metrics: (keyof typeof last)[] = ["diversity", "coherence", "resilience", "beauty"];

    // Single-step alerts
    metrics.forEach((metric) => {
      const change = (last[metric] ?? 0) - (prev[metric] ?? 0);
      if (change <= -0.2) {
        newAlerts.push(`⚠️ ${metric} dropped by ${change.toFixed(2)} since last commit.`);
      } else if (change >= 0.2) {
        newAlerts.push(`✅ ${metric} improved by ${change.toFixed(2)} since last commit.`);
      }
    });

    // Multi-commit trends (5 commits)
    metrics.forEach((metric) => {
      const recent = data.slice(-5).map((e) => e[metric] ?? 0);
      if (recent.length >= 5) {
        const deltas = recent.slice(1).map((v, i) => v - recent[i]);
        const allNegative = deltas.every((d) => d < 0);
        const allPositive = deltas.every((d) => d > 0);

        if (allNegative) {
          newAlerts.push(`🚨 Critical: ${metric} has been declining for 5 commits in a row.`);
        } else if (allPositive) {
          newAlerts.push(`🌟 Strong growth: ${metric} has been rising for 5 commits in a row.`);
        }
      }
    });

    setAlerts(newAlerts);
  }, [data, setAlerts]);

  if (alerts.length === 0) return null;

  return (
    <div className="mb-6 rounded border-l-4 border-yellow-400 bg-yellow-50 p-4">
      <h2 className="mb-2 font-semibold">Trend Alerts</h2>
      <ul className="list-disc pl-6 text-sm">
        {alerts.map((alert, i) => (
          <li key={i}>{alert}</li>
        ))}
      </ul>
    </div>
  );
}
