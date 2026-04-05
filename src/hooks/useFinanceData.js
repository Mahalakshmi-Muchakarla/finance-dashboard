import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";

export function useFinanceData() {
  const { state } = useApp();
  const { transactions, filters } = state;

  const summary = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return {
      totalBalance: income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
      savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
    };
  }, [transactions]);

  const monthlySummary = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      const monthTxns = transactions.filter((t) => {
        const d = parseISO(t.date);
        return isWithinInterval(d, { start, end });
      });
      const income = monthTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const expenses = monthTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
      months.push({
        month: format(date, "MMM"),
        fullMonth: format(date, "MMMM yyyy"),
        income,
        expenses,
        net: income - expenses,
      });
    }
    return months;
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const expenseMap = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
      });
    return Object.entries(expenseMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.merchant.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.note?.toLowerCase().includes(q)
      );
    }

    if (filters.category !== "all") {
      result = result.filter((t) => t.category === filters.category);
    }

    if (filters.type !== "all") {
      result = result.filter((t) => t.type === filters.type);
    }

    if (filters.dateRange !== "all") {
      const now = new Date();
      const ranges = {
        "7d": subMonths(now, 0.25),
        "30d": subMonths(now, 1),
        "90d": subMonths(now, 3),
        "6m": subMonths(now, 6),
      };
      const cutoff = ranges[filters.dateRange];
      if (cutoff) result = result.filter((t) => parseISO(t.date) >= cutoff);
    }

    result.sort((a, b) => {
      if (filters.sortBy === "date") {
        return filters.sortOrder === "desc"
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      }
      if (filters.sortBy === "amount") {
        return filters.sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount;
      }
      if (filters.sortBy === "category") {
        return filters.sortOrder === "desc"
          ? b.category.localeCompare(a.category)
          : a.category.localeCompare(b.category);
      }
      return 0;
    });

    return result;
  }, [transactions, filters]);

  const insights = useMemo(() => {
    const topCategory = categoryBreakdown[0] || null;
    const currentMonth = monthlySummary[5] || {};
    const prevMonth = monthlySummary[4] || {};
    const expenseChange =
      prevMonth.expenses > 0
        ? ((currentMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100
        : 0;

    const avgMonthlyExpense =
      monthlySummary.reduce((s, m) => s + m.expenses, 0) / monthlySummary.length || 0;

    const recentTxns = transactions.slice(0, 5);

    return {
      topCategory,
      expenseChange,
      avgMonthlyExpense,
      recentTxns,
      currentMonth,
      prevMonth,
    };
  }, [categoryBreakdown, monthlySummary, transactions]);

  return { summary, monthlySummary, categoryBreakdown, filteredTransactions, insights };
}
