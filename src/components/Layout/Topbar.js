import React from "react";
import { useApp } from "../../context/AppContext";

const pageTitles = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  insights: "Insights",
};

export default function Topbar({ onMenuToggle }) {
  const { state, dispatch } = useApp();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={onMenuToggle}>☰</button>
        <span className="page-title">{pageTitles[state.activeTab] || "Dashboard"}</span>
      </div>

      <div className="topbar-right">
        <button
          className="theme-toggle"
          onClick={() => dispatch({ type: "TOGGLE_THEME" })}
          title="Toggle theme"
        >
          {state.theme === "dark" ? "☀️" : "🌙"}
        </button>

        <select
          className="role-switcher"
          value={state.role}
          onChange={(e) => dispatch({ type: "SET_ROLE", payload: e.target.value })}
          title="Switch role for demo"
        >
          <option value="admin">🔐 Admin</option>
          <option value="viewer">👁 Viewer</option>
        </select>

        {state.currentUser && (
          <div style={{
            fontSize: "0.82rem",
            color: "var(--text-secondary)",
            padding: "5px 10px",
            background: "var(--bg-input)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            maxWidth: 140,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            👤 {state.currentUser.name}
          </div>
        )}

        <button
          onClick={() => dispatch({ type: "LOGOUT" })}
          title="Sign out"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "7px 12px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)",
            background: "var(--bg-input)",
            color: "var(--accent-red)",
            fontSize: "0.82rem",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = "var(--accent-red-dim)"; e.currentTarget.style.borderColor = "var(--accent-red)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "var(--bg-input)"; e.currentTarget.style.borderColor = "var(--border)"; }}
        >
          ⏻ Sign out
        </button>
      </div>
    </header>
  );
}
