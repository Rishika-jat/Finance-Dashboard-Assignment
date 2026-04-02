import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUpRight,
  ArrowDownRight,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import TransactionModal from "@/components/transactions/TransactionModal";
import { formatCurrency, CATEGORY_COLORS, ALL_CATEGORIES } from "@/utils/calculations";
import type { Transaction, Category } from "@/store/dashboardStore";
import { cn } from "@/lib/utils";

type SortField = "date" | "amount" | "description" | "category";
type SortDir = "asc" | "desc";

export default function Transactions() {
  const { transactions, role, addTransaction, updateTransaction, deleteTransaction } = useApp();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTxn, setEditTxn] = useState<Transaction | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    let list = [...transactions];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    if (filterType !== "all") list = list.filter((t) => t.type === filterType);
    if (filterCategory !== "all") list = list.filter((t) => t.category === filterCategory);

    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") cmp = a.date.localeCompare(b.date);
      else if (sortField === "amount") cmp = a.amount - b.amount;
      else if (sortField === "description") cmp = a.description.localeCompare(b.description);
      else if (sortField === "category") cmp = a.category.localeCompare(b.category);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [transactions, search, filterType, filterCategory, sortField, sortDir]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  };

  const handleEdit = (txn: Transaction) => {
    setEditTxn(txn);
    setModalOpen(true);
  };

  const handleModalSubmit = (data: Omit<Transaction, "id">) => {
    if (editTxn) {
      updateTransaction(editTxn.id, data);
    } else {
      addTransaction(data);
    }
    setEditTxn(null);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="search-input"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              data-testid="filter-type"
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              data-testid="filter-category"
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All categories</option>
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {role === "admin" && (
          <button
            onClick={() => { setEditTxn(null); setModalOpen(true); }}
            data-testid="button-add-transaction"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        )}
      </div>

      <div className="rounded-xl border border-card-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="transactions-table">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {(
                  [
                    { label: "Date", field: "date" as SortField },
                    { label: "Description", field: "description" as SortField },
                    { label: "Category", field: "category" as SortField },
                    { label: "Type", field: null },
                    { label: "Amount", field: "amount" as SortField },
                  ] as Array<{ label: string; field: SortField | null }>
                ).map(({ label, field }) => (
                  <th
                    key={label}
                    className={cn(
                      "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
                      field && "cursor-pointer hover:text-foreground select-none"
                    )}
                    onClick={() => field && handleSort(field)}
                    data-testid={`sort-${label.toLowerCase()}`}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {field && <SortIcon field={field} />}
                    </div>
                  </th>
                ))}
                {role === "admin" && (
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={role === "admin" ? 6 : 5} className="text-center py-12 text-muted-foreground text-sm">
                    No transactions match your filters
                  </td>
                </tr>
              ) : (
                filtered.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-muted/30 transition-colors"
                    data-testid={`row-transaction-${txn.id}`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{txn.date}</td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md"
                          style={{
                            backgroundColor: `${CATEGORY_COLORS[txn.category as Category] ?? "#94a3b8"}18`,
                            color: CATEGORY_COLORS[txn.category as Category] ?? "#94a3b8",
                          }}
                        >
                          {txn.type === "income" ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDownRight className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <span className="font-medium text-foreground truncate">{txn.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[txn.category as Category] ?? "#94a3b8"}18`,
                          color: CATEGORY_COLORS[txn.category as Category] ?? "#94a3b8",
                        }}
                      >
                        {txn.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                          txn.type === "income"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                            : "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                        )}
                      >
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={cn(
                          "font-semibold",
                          txn.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                        )}
                      >
                        {txn.type === "income" ? "+" : "-"}
                        {formatCurrency(txn.amount)}
                      </span>
                    </td>
                    {role === "admin" && (
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          {deleteConfirmId === txn.id ? (
                            <>
                              <button
                                onClick={() => handleDelete(txn.id)}
                                className="rounded px-2 py-1 text-xs bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity font-medium"
                                data-testid={`confirm-delete-${txn.id}`}
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="rounded px-2 py-1 text-xs bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-medium"
                                data-testid={`cancel-delete-${txn.id}`}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(txn)}
                                className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                data-testid={`button-edit-${txn.id}`}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(txn.id)}
                                className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-muted-foreground hover:text-destructive"
                                data-testid={`button-delete-${txn.id}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground bg-muted/30">
            Showing {filtered.length} of {transactions.length} transactions
          </div>
        )}
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTxn(null); }}
        onSubmit={handleModalSubmit}
        editTransaction={editTxn}
      />
    </div>
  );
}
