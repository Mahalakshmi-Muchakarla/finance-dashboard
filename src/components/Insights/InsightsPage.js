import React from "react";
import { useFinanceData } from "../../hooks/useFinanceData";
import { categoryColors, categoryIcons } from "../../data/mockData";
import { formatCurrency } from "../../utils/helpers";


export default function InsightsPage() {
  const { insights, summary, categoryBreakdown, monthlySummary } = useFinanceData();

  const {
    topCategory,
    expenseChange,
    avgMonthlyExpense,
    currentMonth,
    prevMonth,
  } = insights;

  const radarData = categoryBreakdown.slice(0, 6).map((c) => ({
    subject: c.name.split(" ")[0],
    value: c.value,
  }));

  const maxExpense = Math.max(...monthlySummary.map((m) => m.expenses));

  return (
    <div>
      {/* Top insight cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <div className="insight-card">
          <div
            className="insight-icon-wrap"
            style={{ background: "var(--accent-red-dim)", color: "var(--accent-red)" }}
          >
            🔥
          </div>
          <div>
            <div className="insight-label">Highest Spending</div>
            <div className="insight-value">{topCategory ? topCategory.name : "—"}</div>
            <div className="insight-sub">
              {topCategory ? formatCurrency(topCategory.value) + " total" : "No data yet"}
            </div>
          </div>
        </div>

        <div className="insight-card">
          <div
            className="insight-icon-wrap"
            style={{
              background: expenseChange > 0 ? "var(--accent-red-dim)" : "var(--accent-green-dim)",
              color: expenseChange > 0 ? "var(--accent-red)" : "var(--accent-green)",
            }}
          >
            {expenseChange > 0 ? "📈" : "📉"}
          </div>
          <div>
            <div className="insight-label">Month-over-Month</div>
            <div
              className="insight-value"
              style={{
                color: expenseChange > 0 ? "var(--accent-red)" : "var(--accent-green)",
              }}
            >
              {expenseChange >= 0 ? "+" : ""}{expenseChange.toFixed(1)}%
            </div>
            <div className="insight-sub">Expense change vs last month</div>
          </div>
        </div>

        <div className="insight-card">
          <div
            className="insight-icon-wrap"
            style={{ background: "var(--accent-blue-dim)", color: "var(--accent-blue)" }}
          >
            📊
          </div>
          <div>
            <div className="insight-label">Avg Monthly Spend</div>
            <div className="insight-value">{formatCurrency(avgMonthlyExpense)}</div>
            <div className="insight-sub">Over last 6 months</div>
          </div>
        </div>

        <div className="insight-card">
          <div
            className="insight-icon-wrap"
            style={{ background: "var(--accent-amber-dim)", color: "var(--accent-amber)" }}
          >
            💰
          </div>
          <div>
            <div className="insight-label">Savings Rate</div>
            <div
              className="insight-value"
              style={{
                color:
                  summary.savingsRate > 20
                    ? "var(--accent-green)"
                    : summary.savingsRate > 0
                    ? "var(--accent-amber)"
                    : "var(--accent-red)",
              }}
            >
              {summary.savingsRate.toFixed(1)}%
            </div>
            <div className="insight-sub">
              {summary.savingsRate > 20
                ? "Great savings habit! 🌟"
                : summary.savingsRate > 0
                ? "Room to improve"
                : "Spending exceeds income"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Category breakdown table */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Spending by Category</span>
          </div>
          {categoryBreakdown.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <div className="empty-title">No expense data</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {categoryBreakdown.slice(0, 8).map((cat, i) => {
                const pct = (cat.value / categoryBreakdown[0].value) * 100;
                return (
                  <div key={cat.name}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 5,
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "0.9rem" }}>{categoryIcons[cat.name] || "💸"}</span>
                        <span style={{ fontSize: "0.84rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                          {cat.name}
                        </span>
                        {i === 0 && (
                          <span
                            style={{
                              fontSize: "0.65rem",
                              background: "var(--accent-red-dim)",
                              color: "var(--accent-red)",
                              padding: "2px 5px",
                              borderRadius: 4,
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                            }}
                          >
                            Top
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
                        {formatCurrency(cat.value)}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${pct}%`,
                          background: categoryColors[cat.name] || "#5b8dee",
                          opacity: 0.8,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Monthly expenses bar comparison */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Monthly Expense History</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {monthlySummary.map((m) => (
              <div key={m.month}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.83rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                    {m.fullMonth}
                  </span>
                  <span style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    {formatCurrency(m.expenses)}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: maxExpense > 0 ? `${(m.expenses / maxExpense) * 100}%` : "0%",
                      background: m.expenses > avgMonthlyExpense ? "var(--accent-red)" : "var(--accent-blue)",
                      opacity: 0.75,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: "10px", background: "var(--bg-hover)", borderRadius: "var(--radius-sm)", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            🔵 Below average &nbsp;|&nbsp; 🔴 Above average ({formatCurrency(avgMonthlyExpense)}/mo)
          </div>
        </div>
      </div>

      {/* Smart observations */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Smart Observations</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {generateObservations(insights, summary, categoryBreakdown, monthlySummary).map((obs, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 12,
                padding: "12px 14px",
                background: "var(--bg-hover)",
                borderRadius: "var(--radius-sm)",
                border: `1px solid ${obs.borderColor || "var(--border)"}`,
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{obs.icon}</span>
              <div>
                <div style={{ fontSize: "0.87rem", fontWeight: 500, color: "var(--text-primary)", marginBottom: 2 }}>
                  {obs.title}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{obs.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function generateObservations(insights, summary, categoryBreakdown, monthlySummary) {
  const obs = [];

  if (summary.savingsRate > 25) {
    obs.push({ icon: "🌟", title: "Excellent savings discipline", body: `You're saving ${summary.savingsRate.toFixed(1)}% of your income. That's above the recommended 20% threshold.`, borderColor: "rgba(34,208,122,0.2)" });
  } else if (summary.savingsRate < 0) {
    obs.push({ icon: "⚠️", title: "Spending exceeds income", body: "Your expenses are higher than your income. Review your largest expense categories to find cuts.", borderColor: "rgba(255,82,82,0.2)" });
  }

  if (insights.topCategory) {
    obs.push({ icon: "🍽️", title: `${insights.topCategory.name} is your top expense`, body: `You've spent ${formatCurrency(insights.topCategory.value)} on ${insights.topCategory.name} overall. Consider setting a monthly budget for this category.`, borderColor: "rgba(255,181,71,0.2)" });
  }

  if (Math.abs(insights.expenseChange) > 20) {
    const dir = insights.expenseChange > 0 ? "increased" : "decreased";
    obs.push({ icon: insights.expenseChange > 0 ? "📈" : "📉", title: `Expenses ${dir} significantly`, body: `Your spending ${dir} by ${Math.abs(insights.expenseChange).toFixed(1)}% compared to last month.`, borderColor: insights.expenseChange > 0 ? "rgba(255,82,82,0.2)" : "rgba(34,208,122,0.2)" });
  }

  const maxMonth = monthlySummary.reduce((a, b) => (a.expenses > b.expenses ? a : b), { expenses: 0 });
  if (maxMonth.fullMonth) {
    obs.push({ icon: "📅", title: `${maxMonth.fullMonth} was your biggest spending month`, body: `You spent ${formatCurrency(maxMonth.expenses)} that month. Try to understand what drove those higher expenses.` });
  }

  if (obs.length === 0) {
    obs.push({ icon: "📊", title: "Keep tracking your spending", body: "Add more transactions to unlock personalized insights and spending patterns." });
  }

  return obs;
}


