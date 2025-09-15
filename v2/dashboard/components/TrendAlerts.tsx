import React, { useEffect } from "react";

interface MetricTrend {
  name: string;
  values: number[];
}

interface TrendAlertsProps {
  data: MetricTrend[];
  setAlerts: React.Dispatch<React.SetStateAction<string[]>>;
  alerts: string[];
}

export default function TrendAlerts({ data, setAlerts, alerts }: TrendAlertsProps) {
  useEffect(() => {
    const newAlerts: string[] = [];

    for (const metric of data) {
      if (!metric || !metric.values || metric.values.length < 2) continue;

      const values = metric.values;
      const change = values[values.length - 1] - values[values.length - 2];

      if (change < 0) {
        newAlerts.push(`⚠️ ${metric.name} dropped by ${change.toFixed(2)} since last commit.`);
      } else if (change > 0) {
        newAlerts.push(`✅ ${metric.name} improved by ${change.toFixed(2)} since last commit.`);
      }

      if (values.length >= 5) {
        const lastFive = values.slice(-5);
        if (lastFive.every((v, i, arr) => i === 0 || v < arr[i - 1])) {
          newAlerts.push(`🚨 Critical: ${metric.name} has been declining for 5 commits in a row.`);
        }
        if (lastFive.every((v, i, arr) => i === 0 || v > arr[i - 1])) {
          newAlerts.push(
            `🌟 Strong growth: ${metric.name} has been rising for 5 commits in a row.`
          );
        }
      }
    }

    setAlerts(newAlerts);
  }, [data, setAlerts]);

  return (
    <div>
      {alerts.map((alert, i) => (
        <div key={i}>{alert}</div>
      ))}
    </div>
  );
}
