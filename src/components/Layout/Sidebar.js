import React from "react";
import { useApp } from "../../context/AppContext";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "⬡" },
  { id: "transactions", label: "Transactions", icon: "⇄" },
  { id: "insights", label: "Insights", icon: "◉" },
];

export default function Sidebar({ isOpen, onClose }) {
  const { state, dispatch } = useApp();

  const handleNav = (tab) => {
    dispatch({ type: "SET_TAB", payload: tab });
    onClose();
  };

  return (
    <>
      <div className={`sidebar-backdrop ${isOpen ? "open" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">💰</div>
          <span className="brand-name">Fintrax</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${state.activeTab === item.id ? "active" : ""}`}
              onClick={() => handleNav(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
              Active Role
            </div>
            <span className={`role-badge ${state.role}`}>
              {state.role === "admin" ? "🔐" : "👁"} {state.role}
            </span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            {state.role === "admin"
              ? "You can add, edit, and delete transactions."
              : "Read-only mode. Switch to Admin for full access."}
          </div>
        </div>
      </aside>
    </>
  );
}
