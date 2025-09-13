import React from "react";
import { HealthEntry } from "../CulturalHealthDashboard";

interface CommitMetrics extends HealthEntry {
  cvi: number;
}

interface CviGaugeProps {
  selectedCommit: CommitMetrics | null;
}

export default function CviGauge({ selectedCommit }: CviGaugeProps) {
  const latestCvi = selectedCommit ? selectedCommit.cvi : 0;
  const gaugeColor =
    latestCvi > 0.3 ? "#22c55e" : latestCvi < -0.3 ? "#ef4444" : "#facc15";

  return (
    <div className="mb-8 flex flex-col items-center">
      <h2 className="mb-2 text-lg font-semibold">
        Cultural Vitality Index (CVI)
      </h2>
      <div className="relative h-20 w-40">
        <svg viewBox="0 0 100 50" className="h-full w-full">
          <path
            d="M10 50 A40 40 0 0 1 90 50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <path
            d="M10 50 A40 40 0 0 1 90 50"
            fill="none"
            stroke={gaugeColor}
            strokeWidth="8"
            strokeDasharray={`${((latestCvi + 1) / 2) * 126} 126`}
            strokeLinecap="round"
          />
          <text
            x="50"
            y="45"
            textAnchor="middle"
            fontSize="12"
            fill="#111827"
          >
            {latestCvi.toFixed(2)}
          </text>
        </svg>
      </div>
    </div>
  );
}