import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

interface HealthChartProps {
  data: any[];
}

export default function HealthChart({ data }: HealthChartProps) {
  if (!data || data.length === 0) return <p className="text-gray-500">No data available yet.</p>;

  // Determine background trend color
  let trendColor = "#f3f4f6";
  if (data.length >= 2) {
    const last = data[data.length - 1];
    const prev = data[data.length - 2];
    const avgChange =
      ["diversity", "coherence", "resilience", "beauty"].reduce((acc, metric: any) => {
        return acc + ((last[metric] ?? 0) - (prev[metric] ?? 0));
      }, 0) / 4;

    if (avgChange > 0.1) {
      trendColor = "#dcfce7";
    } else if (avgChange < -0.1) {
      trendColor = "#fee2e2";
    }
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
        <YAxis domain={[-1, 1]} />
        <Tooltip />
        <Legend />

        <ReferenceArea y1={-1} y2={1} fill={trendColor} fillOpacity={0.2} />

        <Line type="monotone" dataKey="diversity" stroke="#3b82f6" dot={false} />
        <Line type="monotone" dataKey="coherence" stroke="#22c55e" dot={false} />
        <Line type="monotone" dataKey="resilience" stroke="#f59e0b" dot={false} />
        <Line type="monotone" dataKey="beauty" stroke="#ef4444" dot={false} />

        {/* Rolling averages */}
        <Line
          type="monotone"
          dataKey="diversity_avg"
          stroke="#60a5fa"
          strokeDasharray="5 5"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="coherence_avg"
          stroke="#34d399"
          strokeDasharray="5 5"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="resilience_avg"
          stroke="#fbbf24"
          strokeDasharray="5 5"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="beauty_avg"
          stroke="#f87171"
          strokeDasharray="5 5"
          dot={false}
        />

        {/* Cultural Vitality Index */}
        <Line type="monotone" dataKey="cvi" stroke="#111827" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
