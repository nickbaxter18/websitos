import React, { useEffect, useState } from "react";
import { getApiHealth, getRootHealth, getApiStatus } from "@/utils/apiClient";

export default function StatusPage() {
  const [apiHealth, setApiHealth] = useState<IHealthResponse | null>(null);
  const [rootHealth, setRootHealth] = useState<IHealthResponse | null>(null);
  const [status, setStatus] = useState<IStatusResponse | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      const api = await getApiHealth();
      const root = await getRootHealth();
      const status = await getApiStatus();

      setApiHealth(api);
      setRootHealth(root);
      setStatus(status);
    }

    fetchHealth();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">System Status</h1>
      <div className="space-y-2">
        <p>API Health: {apiHealth?.ok ? "✅ OK" : "❌ Down"}</p>
        <p>Root Health: {rootHealth?.ok ? "✅ OK" : "❌ Down"}</p>
        <p>
          Status: {status?.ok ? "✅ OK" : "❌ Down"} — Version: {status?.version} — Uptime: {status?.uptime}
        </p>
      </div>
    </div>
  );
}