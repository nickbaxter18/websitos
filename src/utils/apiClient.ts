// apiClient.ts - central API wrapper with logging

export async function apiClient<T>(url: string, options: RequestInit = {}): Promise<T> {
  const start = performance.now();
  try {
    console.log("🌐 API Request:", url, options);
    const res = await fetch(url, options);
    const duration = (performance.now() - start).toFixed(2);

    if (!res.ok) {
      console.error(`❌ API Error [${res.status}] (${duration}ms):`, url);
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }

    const data = (await res.json()) as T;
    console.log(`✅ API Response (${duration}ms):`, url, data);
    return data;
  } catch (err) {
    const duration = (performance.now() - start).toFixed(2);
    console.error(`💥 API Exception (${duration}ms):`, url, err);
    throw err;
  }
}

// ------------------------------------------------------------
// Typed endpoint helpers for backend APIs
// ------------------------------------------------------------
export interface HealthResponse {
  ok: boolean;
  status: string;
}

export interface StatusResponse {
  ok: boolean;
  qdrant_ready: boolean;
  openai_ready: boolean;
  frontend_index: boolean;
}

export const getApiHealth = () => apiClient<HealthResponse>("/api/health");
export const getRootHealth = () => apiClient<HealthResponse>("/health");
export const getApiStatus = () => apiClient<StatusResponse>("/api/status");
