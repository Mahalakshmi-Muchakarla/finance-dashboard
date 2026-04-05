import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { generateId } from "../../utils/helpers";

const expenseCategories = ["Food & Dining", "Transport", "Shopping", "Entertainment", "Health", "Utilities", "Rent"];
const incomeCategories = ["Salary", "Freelance", "Investment"];

export default function TransactionModal({ transaction, onClose }) {
  const { dispatch } = useApp();
  const isEditing = !!transaction;

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    merchant: "",
    category: "Food & Dining",
    type: "expense",
    amount: "",
    note: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setForm({
        date: transaction.date,
        merchant: transaction.merchant,
        category: transaction.category,
        type: transaction.type,
        amount: String(transaction.amount),
        note: transaction.note || "",
      });
    }
  }, [transaction]);

  const availableCategories = form.type === "income" ? incomeCategories : expenseCategories;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // If type changes, reset category to relevant first option
      if (name === "type") {
        const cats = value === "income" ? incomeCategories : expenseCategories;
        if (!cats.includes(prev.category)) {
          updated.category = cats[0];
        }
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.merchant.trim()) errs.merchant = "Merchant is required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      errs.amount = "Enter a valid positive amount";
    }
    if (!form.date) errs.date = "Date is required";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const txn = {
      id: isEditing ? transaction.id : generateId(),
      date: form.date,
      merchant: form.merchant.trim(),
      category: form.category,
      type: form.type,
      amount: parseFloat(form.amount),
      note: form.note.trim(),
    };

    dispatch({
      type: isEditing ? "UPDATE_TRANSACTION" : "ADD_TRANSACTION",
      payload: txn,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{isEditing ? "Edit Transaction" : "Add Transaction"}</div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label className="form-label">Type</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["expense", "income"].map((t) => (
              <button
                key={t}
                onClick={() => handleChange({ target: { name: "type", value: t } })}
                style={{
                  flex: 1,
                  padding: "9px",
                  borderRadius: "var(--radius-sm)",
                  border: `1px solid ${form.type === t ? (t === "income" ? "var(--accent-green)" : "var(--accent-red)") : "var(--border)"}`,
                  background: form.type === t ? (t === "income" ? "var(--accent-green-dim)" : "var(--accent-red-dim)") : "var(--bg-input)",
                  color: form.type === t ? (t === "income" ? "var(--accent-green)" : "var(--accent-red)") : "var(--text-secondary)",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  textTransform: "capitalize",
                }}
              >
                {t === "income" ? "↑ Income" : "↓ Expense"}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Merchant / Source</label>
            <input
              className="form-input"
              name="merchant"
              value={form.merchant}
              onChange={handleChange}
              placeholder="e.g. Starbucks"
            />
            {errors.merchant && <div style={{ color: "var(--accent-red)", fontSize: "0.75rem", marginTop: 4 }}>{errors.merchant}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Amount ($)</label>
            <input
              className="form-input"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
            />
            {errors.amount && <div style={{ color: "var(--accent-red)", fontSize: "0.75rem", marginTop: 4 }}>{errors.amount}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" name="category" value={form.category} onChange={handleChange}>
              {availableCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              className="form-input"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
            {errors.date && <div style={{ color: "var(--accent-red)", fontSize: "0.75rem", marginTop: 4 }}>{errors.date}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Note (optional)</label>
          <input
            className="form-input"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Any additional details..."
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEditing ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
