import React from "react";
import { useApp } from "../../context/AppContext";
import { useFinanceData } from "../../hooks/useFinanceData";
import { categoryIcons } from "../../data/mockData";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function RecentTransactions() {
  const { dispatch } = useApp();
  const { insights } = useFinanceData();
  const recent = insights.recentTxns;

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Recent Activity</span>
        <button
          className="btn btn-ghost"
          style={{ padding: "5px 10px", fontSize: "0.78rem" }}
          onClick={() => dispatch({ type: "SET_TAB", payload: "transactions" })}
        >
          View all →
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-title">No transactions yet</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {recent.map((t) => (
            <div
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid var(--border-light)",
              }}
            >
              <div className="txn-avatar">
                {categoryIcons[t.category] || "💸"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.86rem", fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {t.merchant}
                </div>
                <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                  {formatDate(t.date)} · {t.category}
                </div>
              </div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  color: t.type === "income" ? "var(--accent-green)" : "var(--accent-red)",
                  flexShrink: 0,
                }}
              >
                {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
