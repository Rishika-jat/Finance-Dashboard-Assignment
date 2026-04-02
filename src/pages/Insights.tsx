import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useApp } from "@/context/AppContext";
import {
  getHighestSpendingCategory,
  getMonthlyComparison,
  getCategoryBreakdown,
  getMonthlyData,
  getSavingsRate,
  getTotalIncome,
  getTotalExpenses,
  formatCurrency,
  CATEGORY_COLORS,
} from "@/utils/calculations";
import type { Category } from "@/store/dashboardStore";
import { TrendingUp, TrendingDown, Award, AlertTriangle, CheckCircle2, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const InsightCard = ({
  icon,
  title,
  value,
  description,
  type,
  testId,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  type: "positive" | "negative" | "neutral" | "warning";
  testId?: string;
}) => {
  const colors = {
    positive: { bg: "bg-emerald-50 dark:bg-emerald-950/30", icon: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-900" },
    negative: { bg: "bg-red-50 dark:bg-red-950/30", icon: "text-red-500 dark:text-red-400", border: "border-red-100 dark:border-red-900" },
    neutral: { bg: "bg-primary/5", icon: "text-primary", border: "border-primary/10" },
    warning: { bg: "bg-amber-50 dark:bg-amber-950/30", icon: "text-amber-600 dark:text-amber-400", border: "border-amber-100 dark:border-amber-900" },
  };
  const c = colors[type];

  return (
    <div
      data-testid={testId}
      className={cn("rounded-xl border p-5 shadow-sm", c.bg, c.border)}
    >
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 flex-shrink-0", c.icon)}>{icon}</div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-md text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-muted-foreground">{formatCurrency(payload[0]?.value ?? 0)}</p>
    </div>
  );
};

export default function Insights() {
  const { transactions } = useApp();

  const highest = useMemo(() => getHighestSpendingCategory(transactions), [transactions]);
  const comparison = useMemo(() => getMonthlyComparison(transactions), [transactions]);
  const categoryBreakdown = useMemo(() => getCategoryBreakdown(transactions), [transactions]);
  const monthlyData = useMemo(() => getMonthlyData(transactions), [transactions]);
  const savingsRate = useMemo(() => getSavingsRate(transactions), [transactions]);
  const totalIncome = useMemo(() => getTotalIncome(transactions), [transactions]);
  const totalExpenses = useMemo(() => getTotalExpenses(transactions), [transactions]);

  const avgMonthlyExpense = useMemo(() => {
    if (!monthlyData.length) return 0;
    return monthlyData.reduce((s, m) => s + m.expenses, 0) / monthlyData.length;
  }, [monthlyData]);

  const avgMonthlyIncome = useMemo(() => {
    if (!monthlyData.length) return 0;
    return monthlyData.reduce((s, m) => s + m.income, 0) / monthlyData.length;
  }, [monthlyData]);

  if (!transactions.length) {
    return (
      <div className="flex h-64 items-center justify-center p-6">
        <p className="text-muted-foreground text-sm">Add transactions to see insights</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {highest && (
          <InsightCard
            icon={<Award className="h-5 w-5" />}
            title="Highest Spending Category"
            value={highest.category}
            description={`${formatCurrency(highest.amount)} total spent`}
            type="warning"
            testId="insight-highest-category"
          />
        )}

        {comparison && (
          <InsightCard
            icon={parseFloat(comparison.expensePct) > 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            title="Monthly Expense Change"
            value={`${parseFloat(comparison.expensePct) > 0 ? "+" : ""}${comparison.expensePct}%`}
            description={`vs ${comparison.prevMonth} — expenses ${parseFloat(comparison.expensePct) > 0 ? "increased" : "decreased"} this month`}
            type={parseFloat(comparison.expensePct) > 10 ? "negative" : parseFloat(comparison.expensePct) < 0 ? "positive" : "neutral"}
            testId="insight-monthly-comparison"
          />
        )}

        <InsightCard
          icon={savingsRate >= 20 ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          description={savingsRate >= 20 ? "Great! You are saving well" : "Try to save at least 20% of income"}
          type={savingsRate >= 20 ? "positive" : savingsRate >= 10 ? "warning" : "negative"}
          testId="insight-savings-rate"
        />

        <InsightCard
          icon={<DollarSign className="h-5 w-5" />}
          title="Avg Monthly Income"
          value={formatCurrency(avgMonthlyIncome)}
          description="Based on all recorded months"
          type="positive"
          testId="insight-avg-income"
        />

        <InsightCard
          icon={<DollarSign className="h-5 w-5" />}
          title="Avg Monthly Expenses"
          value={formatCurrency(avgMonthlyExpense)}
          description="Based on all recorded months"
          type="neutral"
          testId="insight-avg-expense"
        />

        <InsightCard
          icon={totalIncome > totalExpenses ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          title="Net Financial Position"
          value={formatCurrency(totalIncome - totalExpenses)}
          description="Total income minus total expenses"
          type={totalIncome > totalExpenses ? "positive" : "negative"}
          testId="insight-net-position"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm" data-testid="monthly-comparison-chart">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Monthly Expense Comparison</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Monthly spending by period</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="expenses" name="Expenses" radius={[4, 4, 0, 0]}>
                {monthlyData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === monthlyData.length - 1 ? "#6366f1" : "#6366f144"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm" data-testid="category-breakdown-list">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Category Rankings</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Spending from highest to lowest</p>
          </div>
          <div className="space-y-3">
            {categoryBreakdown.slice(0, 6).map((item, i) => {
              const max = categoryBreakdown[0].value;
              const pct = (item.value / max) * 100;
              return (
                <div key={item.name} data-testid={`category-rank-${i}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-muted-foreground w-4 flex-shrink-0">#{i + 1}</span>
                      <span
                        className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[item.name as Category] ?? "#94a3b8" }}
                      />
                      <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground flex-shrink-0 ml-2">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: CATEGORY_COLORS[item.name as Category] ?? "#94a3b8",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
