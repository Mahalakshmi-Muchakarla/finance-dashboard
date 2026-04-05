import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Layout/Sidebar";
import Topbar from "./components/Layout/Topbar";
import DashboardPage from "./components/Dashboard/DashboardPage";
import TransactionsPage from "./components/Transactions/TransactionsPage";
import InsightsPage from "./components/Insights/InsightsPage";
import AuthPage from "./components/Auth/AuthPage";
import "./index.css";

function AppInner() {
  const { state } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  // Show auth screen if not logged in
  if (!state.isLoggedIn) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (state.activeTab) {
      case "dashboard":     return <DashboardPage />;
      case "transactions":  return <TransactionsPage />;
      case "insights":      return <InsightsPage />;
      default:              return <DashboardPage />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Topbar onMenuToggle={() => setSidebarOpen((o) => !o)} />
        <main className="page-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
