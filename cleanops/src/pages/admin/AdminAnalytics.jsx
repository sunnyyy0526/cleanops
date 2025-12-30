import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import "./AdminAnalytics.css";

const COLORS = ["#6366f1", "#f59e0b", "#ef4444", "#10b981", "#06b6d4"];

export default function AdminAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ======================
     FETCH SAME DATA AS DASHBOARD
  ====================== */
  useEffect(() => {
    api
      .get("/requests")
      .then((res) => setData(res.data || []))
      .catch((err) => console.error("Analytics fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  /* ======================
     DERIVED ANALYTICS
  ====================== */
  const analytics = useMemo(() => {
    if (!data.length) return null;

    const total = data.length;

    const byWardMap = {};
    const byStatusMap = {};
    const byWasteMap = {};
    const operatorMap = {};

    data.forEach((r) => {
      byWardMap[r.ward || "Unknown"] =
        (byWardMap[r.ward || "Unknown"] || 0) + 1;

      byStatusMap[r.status || "Unknown"] =
        (byStatusMap[r.status || "Unknown"] || 0) + 1;

      byWasteMap[r.wasteType || "Unknown"] =
        (byWasteMap[r.wasteType || "Unknown"] || 0) + 1;

      if (r.assignedOperator?.name) {
        operatorMap[r.assignedOperator.name] =
          (operatorMap[r.assignedOperator.name] || 0) + 1;
      }
    });

    const slaBreaches = data.filter(
      (r) => r.status !== "Completed" && r.status !== "Rejected"
    ).length;

    const completed = data.filter(
      (r) => r.status === "Completed" && r.completedAt
    );

    let avgCompletion = 0;
    if (completed.length) {
      const totalTime = completed.reduce(
        (sum, r) =>
          sum + (new Date(r.completedAt) - new Date(r.createdAt)),
        0
      );
      avgCompletion = Math.round(
        totalTime / completed.length / (1000 * 60)
      );
    }

    const topOperators = Object.entries(operatorMap)
      .map(([name, handled]) => ({ name, handled }))
      .sort((a, b) => b.handled - a.handled)
      .slice(0, 7);

    return {
      total,
      slaBreaches,
      avgCompletion,
      byWard: Object.entries(byWardMap).map(([name, count]) => ({ name, count })),
      byStatus: Object.entries(byStatusMap).map(([name, count]) => ({ name, count })),
      byWaste: Object.entries(byWasteMap).map(([name, count]) => ({ name, value: count })),
      topOperators,
    };
  }, [data]);

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (!analytics) return <div className="loading">No analytics data</div>;

  return (
    <div className="admin-analytics">
      <h2>Analytics</h2>

      <section className="panel">
        <h4>Requests per Ward</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.byWard}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="panel">
        <h4>Requests per Status</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.byStatus}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="panel">
        <h4>Requests per Waste Type</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={analytics.byWaste} dataKey="value" outerRadius={110} label>
              {analytics.byWaste.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* 🔥 TOP OPERATORS */}
      <section className="panel">
        <h4>Top Operators</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.topOperators}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="handled" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="grid-3">
        <div className="card stat">
          <span className="label">Avg Completion (mins)</span>
          <span className="value">{analytics.avgCompletion}</span>
        </div>
        <div className="card stat danger">
          <span className="label">SLA Breaches</span>
          <span className="value">{analytics.slaBreaches}</span>
        </div>
        <div className="card stat">
          <span className="label">Total Requests</span>
          <span className="value">{analytics.total}</span>
        </div>
      </section>
    </div>
  );
}