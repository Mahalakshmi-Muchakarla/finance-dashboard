# Fintrax — Finance Dashboard

A clean, interactive personal finance dashboard built with React JS. Designed to help users track financial activity, understand spending patterns, and manage transactions with role-based access control.

---

## Live Preview

> Run locally with the steps below — takes under 2 minutes.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start

# 3. Open in browser
http://localhost:3000
```

No environment variables, no backend, no extra config required.

---

## Features

### Dashboard Overview
- **Summary cards** — Total Balance, Total Income, Total Expenses, and Net Savings with savings rate
- **6-month area chart** — Income vs. Expenses trend over time (Recharts)
- **Pie chart + progress bars** — Top 5 spending categories with proportional breakdown
- **Monthly bar chart** — Side-by-side income vs. expense comparison per month
- **Recent activity feed** — Last 5 transactions with quick-link to full list

### Transactions
- Full transaction table with Date, Merchant, Category, Type, and Amount
- **Search** — Filter by merchant name, category, or note text
- **Filter** — By transaction type (income/expense), category, and date range
- **Sort** — Click any column header (Date, Amount, Category) to sort ascending or descending
- **Pagination** — 12 transactions per page with full page controls
- **Add/Edit modal** — Form with validation for all fields, type-aware category selection
- **Delete with confirmation** — Prevents accidental deletions
- **Export** — Download filtered transactions as CSV or JSON

### Insights
- Highest spending category (with "Top" badge)
- Month-over-month expense change (percentage, color-coded)
- Average monthly spend over 6 months
- Savings rate with contextual feedback
- Category breakdown with animated progress bars
- Monthly expense history with above/below average indicator
- **Smart observations** — Auto-generated, context-aware tips based on your actual data

### Role-Based UI
Switch roles using the dropdown in the top-right corner:

| Role | Capabilities |
|------|-------------|
| **Admin** | View all data, add/edit/delete transactions |
| **Viewer** | Read-only — all controls hidden, notice banner shown |

No backend required — role is simulated on the frontend via React Context.

### Additional Features
- **Dark / Light mode** — Full theme via CSS custom properties, toggle in topbar
- **Local storage persistence** — Transactions and theme survive page refreshes
- **Responsive design** — Works on mobile, tablet, and desktop
- **Empty state handling** — All views gracefully handle missing data
- **Animated charts** — Recharts animations on load

---

## Project Structure

```
src/
├── App.js                        # Root component, page router
├── index.js                      # React entry point
├── index.css                     # Full design system (CSS variables, layout, components)
│
├── context/
│   └── AppContext.js             # Global state: useReducer + Context API
│
├── hooks/
│   └── useFinanceData.js         # Derived data: summaries, filters, insights
│
├── utils/
│   └── helpers.js                # formatCurrency, formatDate, generateId, exportCSV/JSON
│
├── data/
│   └── mockData.js               # 130+ realistic mock transactions across 6 months
│
└── components/
    ├── Layout/
    │   ├── Sidebar.js            # Navigation sidebar with role info
    │   └── Topbar.js             # Page title, theme toggle, role switcher
    │
    ├── Dashboard/
    │   ├── DashboardPage.js      # Orchestrates dashboard layout
    │   ├── SummaryCards.js       # Four KPI cards
    │   ├── Charts.js             # BalanceTrendChart, SpendingBarChart, CategoryPieChart
    │   └── RecentTransactions.js # Mini transaction feed
    │
    ├── Transactions/
    │   ├── TransactionsPage.js   # Filter toolbar, table, pagination, export
    │   └── TransactionModal.js   # Add/Edit form with validation
    │
    └── Insights/
        └── InsightsPage.js       # KPI cards, category breakdown, smart observations
```

---

## State Management Approach

All application state lives in a single `AppContext` using React's built-in `useReducer` hook — no external library needed for this scope.

```
AppContext (useReducer)
  ├── transactions[]       — All transaction records
  ├── role                 — "admin" | "viewer"
  ├── theme                — "dark" | "light"
  ├── filters              — search, category, type, dateRange, sortBy, sortOrder
  └── activeTab            — Current page
```

Derived data (summaries, filtered lists, chart data, insights) is computed in `useFinanceData.js` using `useMemo` — keeping the reducer clean and avoiding redundant recalculations.

State that should persist (transactions + theme) is synced to `localStorage` via `useEffect`.

---

## Design Decisions

**Typography** — DM Serif Display (headings/values) paired with DM Sans (body/labels). The serif gives financial data a sense of weight and authority.

**Color system** — Dark-first with a full light mode. Accent colors are semantic: green = income/positive, red = expense/negative, blue = neutral/interactive, amber = warnings.

**Component philosophy** — Each component does one clear job. Pages orchestrate, components render. Data logic stays in hooks, not components.

**No over-engineering** — Context + useReducer is the right tool for this scope. Redux would be overkill; plain useState would get messy with cross-component state.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| React Context + useReducer | State management |
| Recharts | Charts and visualizations |
| date-fns | Date formatting and math |
| CSS Custom Properties | Theming and design tokens |
| localStorage | Data persistence |

Zero paid dependencies. No UI component library — all components are built from scratch.

---

## Assumptions Made

- Currency is USD throughout
- "6 months" is used as the default data window for trend charts
- Roles are demonstration-only — no authentication layer
- Data resets if localStorage is cleared (by design for a demo)
- Mobile layout hides the Category and Type columns in the transactions table to keep it readable

---

## Possible Extensions

If this were a production app, the natural next steps would be:

- Connect to a real backend / REST API (swap `generateInitialTransactions` for a fetch call)
- Add JWT-based authentication for true RBAC
- Budget goal setting per category
- Recurring transaction detection
- Multi-currency support
- Push notifications for unusual spending

---

## Authentication (Simulated)

Since this is a frontend-only demo, authentication is simulated using localStorage:

- **Sign Up** — creates an account stored in browser localStorage under `finance_dashboard_users`
- **Sign In** — validates email + password against stored accounts
- **Sign Out** — clears session, returns to login screen
- Accounts persist across browser sessions on the same device

**To test:**
1. Go to Sign Up tab → enter name, email, password, pick a role → Create Account
2. You'll be redirected to Sign In automatically
3. Log in with your credentials
4. Use the Sign out button in the top-right to log out

Passwords are stored in plain text in localStorage — this is intentional for a demo. In a real app, passwords would be hashed and stored server-side.

---

