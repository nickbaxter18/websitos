import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Activity,
  Download,
  AlertTriangle,
  RefreshCw,
  Clock,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DiagnosticCockpit() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [healthChecks, setHealthChecks] = useState({});
  const [history, setHistory] = useState([]);
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("date");
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [toast, setToast] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    function showToast(message, type = "info") {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    }

    async function fetchWorkflows() {
      try {
        const res = await fetch("https://api.github.com/repos/nickbaxter18/websitos/actions/runs", {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
          },
        });
        const data = await res.json();
        setWorkflows(data.workflow_runs || []);
        updateHistory({ ci: data.workflow_runs[0]?.conclusion || "unknown" });
      } catch (err) {
        console.error("Error fetching workflows:", err);
        showToast("⚠️ Error fetching workflows", "error");
      } finally {
        setLoading(false);
      }
    }

    async function fetchHealth() {
      const endpoints = [
        { key: "apiHealth", url: "https://websitos.onrender.com/api/health" },
        { key: "apiStatus", url: "https://websitos.onrender.com/api/status" },
        { key: "rootHealth", url: "https://websitos.onrender.com/health" },
      ];
      let results = {};
      for (let ep of endpoints) {
        try {
          const res = await fetch(ep.url);
          results[ep.key] = res.ok ? "success" : "failure";
        } catch (e) {
          results[ep.key] = "failure";
          showToast(`⚠️ Error fetching ${ep.key}`, "error");
        }
      }
      setHealthChecks(results);
      updateHistory({ health: results });
    }

    async function fetchIssues() {
      try {
        const res = await fetch(
          "https://api.github.com/repos/nickbaxter18/websitos/issues?labels=ccf-auto&state=open",
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
              Accept: "application/vnd.github+json",
            },
          }
        );
        const data = await res.json();
        setIssues(data || []);
      } catch (err) {
        console.error("Error fetching issues:", err);
        showToast("⚠️ Error fetching issues", "error");
      }
    }

    function updateHistory(entry) {
      const prev = JSON.parse(localStorage.getItem("diagnosticHistory") || "[]");
      const newEntry = {
        timestamp: new Date().toISOString(),
        ...entry,
      };
      const updated = [newEntry, ...prev].slice(0, 10);
      localStorage.setItem("diagnosticHistory", JSON.stringify(updated));
      setHistory(updated);
    }

    function refreshAll() {
      fetchWorkflows();
      fetchHealth();
      fetchIssues();
      setLastUpdated(new Date());
      showToast("✅ Refreshed successfully", "success");
    }

    refreshAll();
    const interval = setInterval(refreshAll, 60000);
    return () => clearInterval(interval);
  }, []);

  function exportHistory(format = "json") {
    const dataStr = format === "csv" ? toCSV(history) : JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `diagnostic-history.${format}`;
    link.click();
  }

  function toCSV(data) {
    if (!data.length) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers
        .map((h) => {
          const val = row[h];
          if (typeof val === "object") return JSON.stringify(val);
          return val;
        })
        .join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  }

  const chartData = history.map((entry) => ({
    timestamp: new Date(entry.timestamp).toLocaleTimeString(),
    ci: entry.ci === "success" ? 1 : entry.ci === "failure" ? 0 : 0.5,
    apiHealth: entry.health?.apiHealth === "success" ? 1 : 0,
    apiStatus: entry.health?.apiStatus === "success" ? 1 : 0,
    rootHealth: entry.health?.rootHealth === "success" ? 1 : 0,
  }));

  function getPriorityLabel(labels) {
    if (!labels) return null;
    if (labels.find((l) => l.name === "P1"))
      return { text: "P1 - Critical", color: "text-red-600" };
    if (labels.find((l) => l.name === "P2")) return { text: "P2 - High", color: "text-yellow-600" };
    if (labels.find((l) => l.name === "P3"))
      return { text: "P3 - Medium", color: "text-green-600" };
    return null;
  }

  function getGlobalStatus() {
    const failingWorkflows = workflows.filter((wf) => wf.conclusion === "failure");
    const criticalIssues = issues.filter((i) => i.labels.find((l) => l.name === "P1"));
    const highIssues = issues.filter((i) => i.labels.find((l) => l.name === "P2"));
    const mediumIssues = issues.filter((i) => i.labels.find((l) => l.name === "P3"));

    if (failingWorkflows.length > 0)
      return {
        text: "Critical workflow failures detected",
        color: "bg-red-700",
        target: "#workflows",
        count: failingWorkflows.length,
      };
    if (criticalIssues.length > 0)
      return {
        text: "Critical issues open",
        color: "bg-red-600",
        target: "#issues",
        count: criticalIssues.length,
      };
    if (highIssues.length > 0)
      return {
        text: "High priority issues open",
        color: "bg-yellow-500",
        target: "#issues",
        count: highIssues.length,
      };
    if (mediumIssues.length > 0)
      return {
        text: "Medium issues open",
        color: "bg-green-500",
        target: "#issues",
        count: mediumIssues.length,
      };
    return { text: "All clear!", color: "bg-blue-600", target: null, count: 0 };
  }

  const globalStatus = getGlobalStatus();

  function scrollToTarget(target) {
    if (!target) return;
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
      <div className={`col-span-full mb-4 rounded px-4 py-2 text-white ${globalStatus.color}`}>
        <div className="flex items-center justify-between">
          <span>
            {globalStatus.text}
            {globalStatus.count > 0 && (
              <span className="ml-2 rounded-full bg-white px-2 py-1 text-xs text-black">
                {globalStatus.count}
              </span>
            )}
          </span>
          <div className="flex space-x-2">
            {globalStatus.target && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => scrollToTarget(globalStatus.target)}
              >
                <Info className="mr-1 h-4 w-4" /> View Details
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? (
                <ChevronUp className="mr-1 h-4 w-4" />
              ) : (
                <ChevronDown className="mr-1 h-4 w-4" />
              )}
              {showDetails ? "Hide" : "Show"} Summary
            </Button>
          </div>
        </div>
        {showDetails && (
          <div className="mt-2 max-h-40 overflow-y-auto rounded bg-white p-2 text-sm text-black">
            {workflows.some((wf) => wf.conclusion === "failure") && (
              <div className="mb-2">
                <strong>Failing Workflows:</strong>
                <ul className="list-disc pl-5">
                  {workflows
                    .filter((wf) => wf.conclusion === "failure")
                    .map((wf) => (
                      <li key={wf.id}>
                        <a
                          href={wf.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {wf.name} (Branch: {wf.head_branch})
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            )}
            {issues.length > 0 && (
              <div>
                <strong>Open Issues:</strong>
                <ul className="list-disc pl-5">
                  {issues.map((issue) => (
                    <li key={issue.number}>
                      <a
                        href={issue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        #{issue.number} - {issue.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {issues.length === 0 && !workflows.some((wf) => wf.conclusion === "failure") && (
              <div>✅ No issues or workflow failures detected.</div>
            )}
          </div>
        )}
      </div>

      {/* Other cards unchanged */}
    </div>
  );
}
