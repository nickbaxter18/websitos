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
        className={`w-3 h-3 rounded-full animate-pulse ${
          ok ? "bg-green-500" : "bg-red-500"
        }`}
      ></span>
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-2">📊 System Status</h1>
      {lastUpdated && (
        <p className="text-sm text-gray-500 mb-4">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      <div className="mb-6 p-4 bg-white rounded shadow w-full max-w-2xl text-center">
        <h2 className="text-xl font-semibold mb-2">Overall System Status</h2>
        {overallOk !== undefined ? (
          <StatusBadge ok={!!overallOk} />
        ) : (
          <p className="text-gray-500">Checking...</p>
        )}
      </div>

      <button
        onClick={fetchStatus}
        disabled={loading}
        className={`mb-6 px-4 py-2 rounded shadow text-white transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Refreshing..." : "🔄 Refresh Now"}
      </button>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          <p>❌ {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            API Health
            {apiHealth && <StatusBadge ok={apiHealth.ok} />}
          </h2>
          <pre className="text-sm overflow-x-auto">
            {apiHealth ? JSON.stringify(apiHealth, null, 2) : "Loading..."}
          </pre>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Root Health
            {rootHealth && <StatusBadge ok={rootHealth.ok} />}
          </h2>
          <pre className="text-sm overflow-x-auto">
            {rootHealth ? JSON.stringify(rootHealth, null, 2) : "Loading..."}
          </pre>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Extended Status
            {status && <StatusBadge ok={status.ok} />}
          </h2>
          <pre className="text-sm overflow-x-auto">
            {status ? JSON.stringify(status, null, 2) : "Loading..."}
          </pre>
        </div>
      </div>
    </div>
  );
}