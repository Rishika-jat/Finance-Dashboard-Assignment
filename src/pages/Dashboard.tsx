import { useMemo } from "react";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { useApp } from "@/context/AppContext";
import SummaryCard from "@/components/dashboard/SummaryCard";
import BalanceTrendChart from "@/components/dashboard/BalanceTrendChart";
import SpendingPieChart from "@/components/dashboard/SpendingPieChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import {
  getTotalIncome,
  getTotalExpenses,
  getBalance,
  getSavingsRate,
  formatCurrency,
  getMonthlyComparison,
} from "@/utils/calculations";

export default function Dashboard() {
  const { transactions } = useApp();

  const comparison = useMemo(() => getMonthlyComparison(transactions), [transactions]);
  const totalBalance = useMemo(() => getBalance(transactions), [transactions]);
  const totalIncome = useMemo(() => getTotalIncome(transactions), [transactions]);
  const totalExpenses = useMemo(() => getTotalExpenses(transactions), [transactions]);
  const savingsRate = useMemo(() => getSavingsRate(transactions), [transactions]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          subtitle="All time net"
          icon={<Wallet className="h-5 w-5" />}
          accentColor="#6366f1"
          data-testid="card-total-balance"
        />
        <SummaryCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          subtitle="All time"
          trend={comparison ? parseFloat(comparison.incomePct) : undefined}
          icon={<TrendingUp className="h-5 w-5" />}
          accentColor="#22c55e"
          data-testid="card-total-income"
        />
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          subtitle="All time"
          trend={comparison ? parseFloat(comparison.expensePct) : undefined}
          icon={<TrendingDown className="h-5 w-5" />}
          accentColor="#ef4444"
          data-testid="card-total-expenses"
        />
        <SummaryCard
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          subtitle="Of total income"
          icon={<PiggyBank className="h-5 w-5" />}
          accentColor="#f59e0b"
          data-testid="card-savings-rate"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <BalanceTrendChart transactions={transactions} />
        </div>
        <div className="lg:col-span-2">
          <SpendingPieChart transactions={transactions} />
        </div>
      </div>

      <RecentTransactions transactions={transactions} />
    </div>
  );
}
