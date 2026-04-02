import { useState, useCallback } from "react";

export type Role = "admin" | "viewer";
export type TransactionType = "income" | "expense";
export type Category =
  | "Housing"
  | "Food"
  | "Transport"
  | "Entertainment"
  | "Healthcare"
  | "Shopping"
  | "Utilities"
  | "Education"
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Other";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
}

const SEED_TRANSACTIONS: Transaction[] = [
  { id: "1", date: "2026-04-01", description: "Monthly Salary", amount: 5200, category: "Salary", type: "income" },
  { id: "2", date: "2026-04-01", description: "Apartment Rent", amount: 1500, category: "Housing", type: "expense" },
  { id: "3", date: "2026-04-02", description: "Grocery Shopping", amount: 145.5, category: "Food", type: "expense" },
  { id: "4", date: "2026-04-03", description: "Freelance Project", amount: 850, category: "Freelance", type: "income" },
  { id: "5", date: "2026-04-04", description: "Netflix Subscription", amount: 15.99, category: "Entertainment", type: "expense" },
  { id: "6", date: "2026-04-05", description: "Uber Rides", amount: 42.0, category: "Transport", type: "expense" },
  { id: "7", date: "2026-04-06", description: "Doctor Appointment", amount: 80, category: "Healthcare", type: "expense" },
  { id: "8", date: "2026-04-07", description: "Investment Dividend", amount: 320, category: "Investment", type: "income" },
  { id: "9", date: "2026-04-08", description: "Electric Bill", amount: 95, category: "Utilities", type: "expense" },
  { id: "10", date: "2026-04-09", description: "Online Course", amount: 49.99, category: "Education", type: "expense" },
  { id: "11", date: "2026-04-10", description: "Amazon Shopping", amount: 211.45, category: "Shopping", type: "expense" },
  { id: "12", date: "2026-04-11", description: "Restaurant Dinner", amount: 87.5, category: "Food", type: "expense" },
  { id: "13", date: "2026-04-12", description: "Gym Membership", amount: 45, category: "Healthcare", type: "expense" },
  { id: "14", date: "2026-04-13", description: "Spotify Premium", amount: 9.99, category: "Entertainment", type: "expense" },
  { id: "15", date: "2026-04-14", description: "Consulting Work", amount: 1200, category: "Freelance", type: "income" },
  { id: "16", date: "2026-04-15", description: "Internet Bill", amount: 60, category: "Utilities", type: "expense" },
  { id: "17", date: "2026-04-16", description: "Coffee & Snacks", amount: 34.2, category: "Food", type: "expense" },
  { id: "18", date: "2026-04-17", description: "Clothing Purchase", amount: 158, category: "Shopping", type: "expense" },
  { id: "19", date: "2026-04-18", description: "Bus Pass", amount: 55, category: "Transport", type: "expense" },
  { id: "20", date: "2026-04-19", description: "Book Purchase", amount: 27.5, category: "Education", type: "expense" },
  { id: "21", date: "2026-03-01", description: "Monthly Salary", amount: 5200, category: "Salary", type: "income" },
  { id: "22", date: "2026-03-01", description: "Apartment Rent", amount: 1500, category: "Housing", type: "expense" },
  { id: "23", date: "2026-03-05", description: "Freelance Project", amount: 600, category: "Freelance", type: "income" },
  { id: "24", date: "2026-03-10", description: "Grocery Shopping", amount: 132, category: "Food", type: "expense" },
  { id: "25", date: "2026-03-12", description: "Dining Out", amount: 76, category: "Food", type: "expense" },
  { id: "26", date: "2026-03-15", description: "Investment Return", amount: 250, category: "Investment", type: "income" },
  { id: "27", date: "2026-03-18", description: "Electric Bill", amount: 88, category: "Utilities", type: "expense" },
  { id: "28", date: "2026-03-20", description: "Medical Checkup", amount: 120, category: "Healthcare", type: "expense" },
  { id: "29", date: "2026-03-22", description: "Online Shopping", amount: 189.99, category: "Shopping", type: "expense" },
  { id: "30", date: "2026-03-25", description: "Transport (Uber)", amount: 38, category: "Transport", type: "expense" },
  { id: "31", date: "2026-02-01", description: "Monthly Salary", amount: 5200, category: "Salary", type: "income" },
  { id: "32", date: "2026-02-01", description: "Apartment Rent", amount: 1500, category: "Housing", type: "expense" },
  { id: "33", date: "2026-02-07", description: "Freelance Work", amount: 450, category: "Freelance", type: "income" },
  { id: "34", date: "2026-02-14", description: "Valentine Dinner", amount: 110, category: "Food", type: "expense" },
  { id: "35", date: "2026-02-18", description: "Investment Dividend", amount: 280, category: "Investment", type: "income" },
  { id: "36", date: "2026-02-20", description: "Utilities Bill", amount: 145, category: "Utilities", type: "expense" },
  { id: "37", date: "2026-02-22", description: "Shopping Spree", amount: 340, category: "Shopping", type: "expense" },
  { id: "38", date: "2026-02-25", description: "Grocery Run", amount: 118, category: "Food", type: "expense" },
];

const STORAGE_KEY = "finance_dashboard_transactions";
const ROLE_KEY = "finance_dashboard_role";

function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Transaction[];
  } catch {
    // ignore
  }
  return SEED_TRANSACTIONS;
}

function loadRole(): Role {
  try {
    const raw = localStorage.getItem(ROLE_KEY);
    if (raw === "admin" || raw === "viewer") return raw;
  } catch {
    // ignore
  }
  return "admin";
}

export function useDashboardStore() {
  const [transactions, setTransactionsState] = useState<Transaction[]>(loadTransactions);
  const [role, setRoleState] = useState<Role>(loadRole);

  const setTransactions = useCallback((txns: Transaction[]) => {
    setTransactionsState(txns);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(txns));
  }, []);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    localStorage.setItem(ROLE_KEY, r);
  }, []);

  const addTransaction = useCallback(
    (txn: Omit<Transaction, "id">) => {
      const newTxn: Transaction = { ...txn, id: Date.now().toString() };
      setTransactions([newTxn, ...transactions]);
      return newTxn;
    },
    [transactions, setTransactions]
  );

  const updateTransaction = useCallback(
    (id: string, updates: Partial<Omit<Transaction, "id">>) => {
      setTransactions(transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    },
    [transactions, setTransactions]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions(transactions.filter((t) => t.id !== id));
    },
    [transactions, setTransactions]
  );

  return {
    transactions,
    role,
    setRole,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}

export type DashboardStore = ReturnType<typeof useDashboardStore>;
