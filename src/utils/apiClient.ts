export async function getApiHealth(): Promise<IHealthResponse> {
  const res = await fetch("/api/health");
  return res.json();
}

export async function getRootHealth(): Promise<IHealthResponse> {
  const res = await fetch("/health");
  return res.json();
}

export async function getApiStatus(): Promise<IStatusResponse> {
  const res = await fetch("/api/status");
  return res.json();
}