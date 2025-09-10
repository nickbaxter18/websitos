// Stubbed API client for CI

export type HealthResponse = {
  ok: boolean;
};

export type StatusResponse = {
  ok: boolean;
  version: string;
  uptime: string;
};

export async function getApiHealth(): Promise<HealthResponse> {
  return { ok: true };
}

export async function getRootHealth(): Promise<HealthResponse> {
  return { ok: true };
}

export async function getApiStatus(): Promise<StatusResponse> {
  return { ok: true, version: "1.0.0", uptime: "100%" };
}
