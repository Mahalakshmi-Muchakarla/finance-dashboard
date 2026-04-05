import React, { createContext, useContext, useReducer, useEffect } from "react";
import { generateInitialTransactions } from "../data/mockData";

const AppContext = createContext(null);

const STORAGE_KEY = "finance_dashboard_state";
const USERS_KEY = "finance_dashboard_users";

const initialState = {
  transactions: [],
  role: "admin",
  theme: "dark",
  filters: {
    search: "",
    category: "all",
    type: "all",
    dateRange: "all",
    sortBy: "date",
    sortOrder: "desc",
  },
  activeTab: "dashboard",
  isLoggedIn: false,
  currentUser: null,
  authPage: "login",
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, transactions: action.payload };
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "dark" ? "light" : "dark" };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "RESET_FILTERS":
      return { ...state, filters: { ...initialState.filters } };
    case "ADD_TRANSACTION": {
      return { ...state, transactions: [action.payload, ...state.transactions] };
    }
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case "SET_TAB":
      return { ...state, activeTab: action.payload };
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        currentUser: action.payload,
        role: action.payload.role,
        activeTab: "dashboard",
      };
    case "LOGOUT":
      return {
        ...initialState,
        transactions: state.transactions,
        theme: state.theme,
        isLoggedIn: false,
        currentUser: null,
        authPage: "login",
      };
    case "SET_AUTH_PAGE":
      return { ...state, authPage: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: "INIT", payload: parsed.transactions || generateInitialTransactions() });
        if (parsed.theme && parsed.theme !== "dark") dispatch({ type: "TOGGLE_THEME" });
      } else {
        dispatch({ type: "INIT", payload: generateInitialTransactions() });
      }
    } catch {
      dispatch({ type: "INIT", payload: generateInitialTransactions() });
    }
  }, []);

  useEffect(() => {
    if (state.transactions.length > 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ transactions: state.transactions, theme: state.theme })
      );
    }
  }, [state.transactions, state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

// Simulated user DB in localStorage
export function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}
export function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
export function findUser(email, password) {
  return getUsers().find((u) => u.email === email && u.password === password) || null;
}
export function emailExists(email) {
  return getUsers().some((u) => u.email === email);
}
