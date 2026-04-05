import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useFinanceData } from "../../hooks/useFinanceData";
import { categoryIcons, categories } from "../../data/mockData";
import { formatCurrency, formatDate, exportToCSV, exportToJSON } from "../../utils/helpers";
import TransactionModal from "./TransactionModal";

const PAGE_SIZE = 12;

export default function TransactionsPage() {
  const { state, dispatch } = useApp();
  const { filteredTransactions } = useFinanceData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const isAdmin = state.role === "admin";

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);
  const paginated = filteredTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (key, value) => {
    dispatch({ type: "SET_FILTER", payload: { [key]: value } });
    setPage(1);
  };

  const handleSort = (field) => {
    if (state.filters.sortBy === field) {
      handleFilterChange("sortOrder", state.filters.sortOrder === "desc" ? "asc" : "desc");
    } else {
      dispatch({ type: "SET_FILTER", payload: { sortBy: field, sortOrder: "desc" } });
    }
    setPage(1);
  };

  const sortIcon = (field) => {
    if (state.filters.sortBy !== field) return " ↕";
    return state.filters.sortOrder === "desc" ? " ↓" : " ↑";
  };

  const handleEdit = (txn) => {
    setEditingTxn(txn);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
    setDeleteConfirm(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTxn(null);
  };

  return (
    <div>
      {!isAdmin && (
        <div className="viewer-notice">
          <span>👁</span>
          You're in Viewer mode — read only. Switch to Admin to add or edit transactions.
        </div>
      )}

      {/* Toolbar */}
      <div className="transactions-toolbar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search merchant, category..."
            value={state.filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={state.filters.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          className="filter-select"
          value={state.filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={state.filters.dateRange}
          onChange={(e) => handleFilterChange("dateRange", e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="6m">Last 6 Months</option>
        </select>

        {(state.filters.search || state.filters.category !== "all" || state.filters.type !== "all" || state.filters.dateRange !== "all") && (
          <button
            className="btn btn-ghost"
            style={{ fontSize: "0.8rem" }}
            onClick={() => { dispatch({ type: "RESET_FILTERS" }); setPage(1); }}
          >
            Clear filters
          </button>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" style={{ fontSize: "0.8rem" }} onClick={() => exportToCSV(filteredTransactions)} title="Export CSV">
            ⬇ CSV
          </button>
          <button className="btn btn-ghost" style={{ fontSize: "0.8rem" }} onClick={() => exportToJSON(filteredTransactions)} title="Export JSON">
            ⬇ JSON
          </button>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="txn-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort("date")}>Date{sortIcon("date")}</th>
                <th>Merchant</th>
                <th className="sortable" onClick={() => handleSort("category")}>Category{sortIcon("category")}</th>
                <th>Type</th>
                <th className="sortable" onClick={() => handleSort("amount")} style={{ textAlign: "right" }}>Amount{sortIcon("amount")}</th>
                {isAdmin && <th style={{ textAlign: "center" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5}>
                    <div className="empty-state">
                      <div className="empty-icon">🔎</div>
                      <div className="empty-title">No transactions found</div>
                      <div className="empty-sub">Try adjusting your filters or search term</div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((t) => (
                  <tr key={t.id}>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.82rem", whiteSpace: "nowrap" }}>
                      {formatDate(t.date)}
                    </td>
                    <td>
                      <div className="txn-merchant">
                        <div className="txn-avatar">{categoryIcons[t.category] || "💸"}</div>
                        <div>
                          <div className="txn-name">{t.merchant}</div>
                          {t.note && <div className="txn-date">{t.note}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-pill">{t.category}</span>
                    </td>
                    <td>
                      <span className={`type-badge ${t.type}`}>
                        {t.type === "income" ? "↑" : "↓"} {t.type}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className={t.type === "income" ? "amount-income" : "amount-expense"}>
                        {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button className="btn-icon" title="Edit" onClick={() => handleEdit(t)}>✏️</button>
                          {deleteConfirm === t.id ? (
                            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                              <button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: "0.75rem" }} onClick={() => handleDelete(t.id)}>Confirm</button>
                              <button className="btn-icon" onClick={() => setDeleteConfirm(null)}>✕</button>
                            </div>
                          ) : (
                            <button className="btn-icon" title="Delete" onClick={() => setDeleteConfirm(t.id)}>🗑️</button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length > PAGE_SIZE && (
          <div className="pagination" style={{ padding: "12px 16px" }}>
            <div className="pagination-info">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </div>
            <div className="pagination-controls">
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
              <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i));
                return (
                  <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>
                    {p}
                  </button>
                );
              })}
              <button className="page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
              <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <TransactionModal
          transaction={editingTxn}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
