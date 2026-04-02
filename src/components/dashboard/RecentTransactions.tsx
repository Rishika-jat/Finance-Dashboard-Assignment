import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency, CATEGORY_COLORS } from "@/utils/calculations";
import type { Transaction, Category } from "@/store/dashboardStore";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: Props) {
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm" data-testid="recent-transactions">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Last 5 activities</p>
        </div>
        <Link
          href="/transactions"
          className="text-xs font-medium text-primary hover:underline"
          data-testid="view-all-transactions"
        >
          View all
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">No transactions yet</p>
      ) : (
        <ul className="space-y-3">
          {recent.map((txn) => (
            <li key={txn.id} className="flex items-center gap-3" data-testid={`recent-txn-${txn.id}`}>
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: `${CATEGORY_COLORS[txn.category as Category] ?? "#94a3b8"}18`,
                  color: CATEGORY_COLORS[txn.category as Category] ?? "#94a3b8",
                }}
              >
                {txn.type === "income" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{txn.description}</p>
                <p className="text-xs text-muted-foreground">{txn.category} · {txn.date}</p>
              </div>
              <span
                className={cn(
                  "text-sm font-semibold flex-shrink-0",
                  txn.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                )}
              >
                {txn.type === "income" ? "+" : "-"}
                {formatCurrency(txn.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
