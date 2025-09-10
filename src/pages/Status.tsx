import React, { useEffect, useState } from "react";
import {
  getApiHealth,
  getRootHealth,
  getApiStatus,
  HealthResponse,
  StatusResponse,
} from "@/utils/apiClient";

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span className="flex items-center space-x-2">
      <span
        className={`h-3 w-3 animate-pulse rounded-full ${ok ? "bg-green-500" : "bg-red-500"}`}
      ></span>
      <span
        className={`rounded-full px-3 py-1 text-sm font-semibold ${
          ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {ok ? "✅ OK" : "❌ DOWN"}
      </span>
    </span>
  );
}

export default function Status() {
  const [apiHealth, setApiHealth] = useState<HealthResponse | null>(null);
  const [rootHealth, setRootHealth] = useState<HealthResponse | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchStatus() {
    try {
      setLoading(true);
      const [apiH, rootH, stat] = await Promise.all([
        getApiHealth(),
        getRootHealth(),
        getApiStatus(),
      ]);
      setApiHealth(apiH);
      setRootHealth(rootH);
      setStatus(stat);
      setError(null);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || "Failed to fetch status");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const overallOk = apiHealth?.ok && rootHealth?.ok && status?.ok;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="mb-2 text-3xl font-bold">📊 System Status</h1>
      {lastUpdated && (
        <p className="mb-4 text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      <div className="mb-6 w-full max-w-2xl rounded bg-white p-4 text-center shadow">
        <h2 className="mb-2 text-xl font-semibold">Overall System Status</h2>
        {overallOk !== undefined ? (
          <StatusBadge ok={!!overallOk} />
        ) : (
          <p className="text-gray-500">Checking...</p>
        )}
      </div>

      <button
        onClick={fetchStatus}
        disabled={loading}
        className={`mb-6 rounded px-4 py-2 text-white shadow transition ${
          loading ? "cursor-not-allowed bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Refreshing..." : "🔄 Refresh Now"}
      </button>

      {error && (
        <div className="mb-6 rounded bg-red-100 p-4 text-red-700">
          <p>❌ {error}</p>
        </div>
      )}

      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded bg-white p-4 shadow">
          <h2 className="mb-2 flex items-center justify-between text-lg font-semibold">
            API Health
            {apiHealth && <StatusBadge ok={apiHealth.ok} />}
          </h2>
          <pre className="overflow-x-auto text-sm">
            {apiHealth ? JSON.stringify(apiHealth, null, 2) : "Loading..."}
          </pre>
        </div>

        <div className="rounded bg-white p-4 shadow">
          <h2 className="mb-2 flex items-center justify-between text-lg font-semibold">
            Root Health
            {rootHealth && <StatusBadge ok={rootHealth.ok} />}
          </h2>
          <pre className="overflow-x-auto text-sm">
            {rootHealth ? JSON.stringify(rootHealth, null, 2) : "Loading..."}
          </pre>
        </div>

        <div className="rounded bg-white p-4 shadow">
          <h2 className="mb-2 flex items-center justify-between text-lg font-semibold">
            Extended Status
            {status && <StatusBadge ok={status.ok} />}
          </h2>
          <pre className="overflow-x-auto text-sm">
            {status ? JSON.stringify(status, null, 2) : "Loading..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
