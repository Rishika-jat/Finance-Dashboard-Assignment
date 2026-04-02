import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/utils/calculations";
import type { Transaction } from "@/store/dashboardStore";
import { cn } from "@/lib/utils";

const schema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters"),
  amount: z.coerce.number().positive("Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, "id">) => void;
  editTransaction?: Transaction | null;
}

export default function TransactionModal({ open, onClose, onSubmit, editTransaction }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const watchedType = watch("type");
  const categories = watchedType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (editTransaction) {
      reset({
        description: editTransaction.description,
        amount: editTransaction.amount,
        date: editTransaction.date,
        type: editTransaction.type,
        category: editTransaction.category,
      });
    } else {
      reset({ type: "expense", date: new Date().toISOString().split("T")[0] });
    }
  }, [editTransaction, reset, open]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      description: data.description,
      amount: data.amount,
      date: data.date,
      type: data.type,
      category: data.category as any,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-card border border-card-border shadow-xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-foreground">
            {editTransaction ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            data-testid="modal-close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Type</label>
            <div className="flex gap-2">
              {(["income", "expense"] as const).map((t) => (
                <label
                  key={t}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium cursor-pointer transition-all",
                    watchedType === t
                      ? t === "income"
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                        : "border-red-400 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                      : "border-border bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <input type="radio" value={t} {...register("type")} className="sr-only" />
                  <span className="capitalize">{t}</span>
                </label>
              ))}
            </div>
            {errors.type && <p className="mt-1 text-xs text-destructive">{errors.type.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Description</label>
            <input
              {...register("description")}
              data-testid="input-description"
              placeholder="e.g. Monthly Salary"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
            {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("amount")}
                data-testid="input-amount"
                placeholder="0.00"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
              {errors.amount && <p className="mt-1 text-xs text-destructive">{errors.amount.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Date</label>
              <input
                type="date"
                {...register("date")}
                data-testid="input-date"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
              {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Category</label>
            <select
              {...register("category")}
              data-testid="input-category"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-destructive">{errors.category.message}</p>}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              data-testid="button-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              data-testid="button-submit"
            >
              {editTransaction ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
