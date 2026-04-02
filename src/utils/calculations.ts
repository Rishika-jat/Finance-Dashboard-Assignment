import type { Transaction, Category } from "@/store/dashboardStore";

export function getTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getBalance(transactions: Transaction[]): number {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
}

export function getMonthlyData(transactions: Transaction[]) {
  const monthMap: Record<string, { income: number; expenses: number; month: string }> = {};

  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
    if (!monthMap[key]) monthMap[key] = { income: 0, expenses: 0, month: label };
    if (t.type === "income") monthMap[key].income += t.amount;
    else monthMap[key].expenses += t.amount;
  });

  return Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);
}

export function getCategoryBreakdown(transactions: Transaction[]) {
  const catMap: Record<string, number> = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      catMap[t.category] = (catMap[t.category] ?? 0) + t.amount;
    });

  return Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
}

export function getHighestSpendingCategory(transactions: Transaction[]): { category: string; amount: number } | null {
  const breakdown = getCategoryBreakdown(transactions);
  if (!breakdown.length) return null;
  return { category: breakdown[0].name, amount: breakdown[0].value };
}

export function getMonthlyComparison(transactions: Transaction[]) {
  const monthly = getMonthlyData(transactions);
  if (monthly.length < 2) return null;
  const last = monthly[monthly.length - 1];
  const prev = monthly[monthly.length - 2];
  const expenseDiff = last.expenses - prev.expenses;
  const incomeDiff = last.income - prev.income;
  return {
    currentMonth: last.month,
    prevMonth: prev.month,
    expenseDiff,
    incomeDiff,
    expensePct: prev.expenses ? ((expenseDiff / prev.expenses) * 100).toFixed(1) : "0",
    incomePct: prev.income ? ((incomeDiff / prev.income) * 100).toFixed(1) : "0",
  };
}

export function getSavingsRate(transactions: Transaction[]): number {
  const income = getTotalIncome(transactions);
  const expenses = getTotalExpenses(transactions);
  if (!income) return 0;
  return Math.max(0, ((income - expenses) / income) * 100);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export const CATEGORY_COLORS: Record<Category, string> = {
  Housing: "#6366f1",
  Food: "#f59e0b",
  Transport: "#10b981",
  Entertainment: "#8b5cf6",
  Healthcare: "#ef4444",
  Shopping: "#f97316",
  Utilities: "#06b6d4",
  Education: "#84cc16",
  Salary: "#22c55e",
  Freelance: "#3b82f6",
  Investment: "#a855f7",
  Other: "#94a3b8",
};

export const ALL_CATEGORIES: Category[] = [
  "Salary", "Freelance", "Investment",
  "Housing", "Food", "Transport", "Entertainment",
  "Healthcare", "Shopping", "Utilities", "Education", "Other",
];

export const INCOME_CATEGORIES: Category[] = ["Salary", "Freelance", "Investment", "Other"];
export const EXPENSE_CATEGORIES: Category[] = [
  "Housing", "Food", "Transport", "Entertainment",
  "Healthcare", "Shopping", "Utilities", "Education", "Other",
];
