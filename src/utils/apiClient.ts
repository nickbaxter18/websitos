// Stubbed API client for CI

export type HealthResponse = {
  status: string;
};

export type StatusResponse = {
  version: string;
  uptime: string;
};

export async function getApiHealth(): Promise<HealthResponse> {
  return { status: "ok" };
}

export async function getRootHealth(): Promise<HealthResponse> {
  return { status: "ok" };
}

export async function getApiStatus(): Promise<StatusResponse> {
  return { version: "1.0.0", uptime: "100%" };
}