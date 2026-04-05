import React from "react";
import SummaryCards from "./SummaryCards";
import { BalanceTrendChart, SpendingBarChart, CategoryPieChart } from "./Charts";
import RecentTransactions from "./RecentTransactions";

export default function DashboardPage() {
  return (
    <div>
      <SummaryCards />

      <div className="grid-3-1">
        <BalanceTrendChart />
        <CategoryPieChart />
      </div>

      <div className="grid-2">
        <SpendingBarChart />
        <RecentTransactions />
      </div>
    </div>
  );
}
