// Shared types for Cultural Health Dashboard

export interface MetricTrend {
  name: string;
  values: number[];
}

export interface CommitMetrics extends MetricTrend {
  id: string;
  commit: string;
  timestamp: string;
  diversity: number;
  coherence: number;
  resilience: number;
  beauty: number;
  cvi: number;
}

export type CommitMetricsNullable = CommitMetrics | null;
