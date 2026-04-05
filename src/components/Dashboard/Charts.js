import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useFinanceData } from "../../hooks/useFinanceData";
import { categoryColors } from "../../data/mockData";
import { formatCurrency } from "../../utils/helpers";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "var(--shadow-md)",
        fontSize: "0.82rem",
      }}>
        <div style={{ color: "var(--text-secondary)", marginBottom: 6, fontWeight: 600 }}>{label}</div>
        {payload.map((entry) => (
          <div key={entry.name} style={{ color: entry.color, display: "flex", justifyContent: "space-between", gap: 16 }}>
            <span style={{ textTransform: "capitalize" }}>{entry.name}</span>
            <span style={{ fontWeight: 600 }}>{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function BalanceTrendChart() {
  const { monthlySummary } = useFinanceData();

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-header">
        <span className="card-title">6-Month Balance Trend</span>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Income vs Expenses</span>
      </div>
      <div className="chart-container" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlySummary} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d07a" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22d07a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff5252" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ff5252" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.78rem", color: "var(--text-secondary)", paddingTop: 8 }} />
            <Area type="monotone" dataKey="income" name="Income" stroke="#22d07a" strokeWidth={2} fill="url(#incomeGrad)" dot={false} activeDot={{ r: 4 }} />
            <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ff5252" strokeWidth={2} fill="url(#expenseGrad)" dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SpendingBarChart() {
  const { monthlySummary } = useFinanceData();

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-header">
        <span className="card-title">Monthly Comparison</span>
      </div>
      <div className="chart-container" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlySummary} margin={{ top: 5, right: 5, left: -10, bottom: 0 }} barSize={12} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.78rem", color: "var(--text-secondary)", paddingTop: 8 }} />
            <Bar dataKey="income" name="Income" fill="#22d07a" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
            <Bar dataKey="expenses" name="Expenses" fill="#ff5252" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CategoryPieChart() {
  const { categoryBreakdown } = useFinanceData();
  const top5 = categoryBreakdown.slice(0, 5);
  const total = top5.reduce((s, c) => s + c.value, 0);

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "10px 14px",
          boxShadow: "var(--shadow-md)",
          fontSize: "0.82rem",
        }}>
          <div style={{ color: item.payload.fill, fontWeight: 600 }}>{item.name}</div>
          <div style={{ color: "var(--text-primary)", marginTop: 3 }}>{formatCurrency(item.value)}</div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{((item.value / total) * 100).toFixed(1)}% of top 5</div>
        </div>
      );
    }
    return null;
  };

  if (top5.length === 0) {
    return (
      <div className="card">
        <div className="card-header"><span className="card-title">Spending Breakdown</span></div>
        <div className="empty-state"><div className="empty-icon">📊</div><div className="empty-title">No expense data yet</div></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Spending Breakdown</span>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Top 5 categories</span>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ height: 160, width: 160, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={top5} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={3} dataKey="value">
                {top5.map((entry, i) => (
                  <Cell key={entry.name} fill={categoryColors[entry.name] || "#888"} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {top5.map((entry) => (
            <div key={entry.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: categoryColors[entry.name] || "#888", display: "inline-block" }} />
                  {entry.name}
                </span>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  {formatCurrency(entry.value, true)}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(entry.value / top5[0].value) * 100}%`,
                    background: categoryColors[entry.name] || "#888",
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
