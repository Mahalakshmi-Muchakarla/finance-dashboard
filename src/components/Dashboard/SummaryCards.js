import React from "react";
import { useFinanceData } from "../../hooks/useFinanceData";
import { formatCurrency } from "../../utils/helpers";

export default function SummaryCards() {
  const { summary } = useFinanceData();
  const { totalBalance, totalIncome, totalExpenses, savingsRate } = summary;

  const cards = [
    {
      label: "Total Balance",
      value: formatCurrency(totalBalance),
      icon: "💳",
      color: "var(--accent-blue)",
      bg: "var(--accent-blue-dim)",
      sub: `${savingsRate.toFixed(1)}% savings rate`,
      positive: totalBalance >= 0,
    },
    {
      label: "Total Income",
      value: formatCurrency(totalIncome),
      icon: "📈",
      color: "var(--accent-green)",
      bg: "var(--accent-green-dim)",
      sub: "All time income",
      positive: true,
    },
    {
      label: "Total Expenses",
      value: formatCurrency(totalExpenses),
      icon: "📉",
      color: "var(--accent-red)",
      bg: "var(--accent-red-dim)",
      sub: "All time spending",
      positive: false,
    },
    {
      label: "Net Savings",
      value: formatCurrency(totalBalance, true),
      icon: "🏦",
      color: "var(--accent-amber)",
      bg: "var(--accent-amber-dim)",
      sub: totalBalance >= 0 ? "You're in the green 🎉" : "More spending than income",
      positive: totalBalance >= 0,
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card) => (
        <div className="summary-card" key={card.label}>
          <div className="card-label">{card.label}</div>
          <div
            className="card-value"
            style={{ color: card.label === "Total Balance" ? (totalBalance >= 0 ? "var(--accent-green)" : "var(--accent-red)") : "var(--text-primary)" }}
          >
            {card.value}
          </div>
          <div className="card-sub">
            <span style={{ color: card.positive ? "var(--accent-green)" : "var(--accent-red)" }}>
              {card.positive ? "▲" : "▼"}
            </span>
            {card.sub}
          </div>
          <div
            className="card-icon"
            style={{ background: card.bg, color: card.color }}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
