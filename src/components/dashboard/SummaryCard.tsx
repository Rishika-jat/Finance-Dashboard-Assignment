import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  icon: React.ReactNode;
  accentColor: string;
  "data-testid"?: string;
}

export default function SummaryCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  accentColor,
  "data-testid": testId,
}: SummaryCardProps) {
  return (
    <div
      data-testid={testId}
      className="rounded-xl border border-card-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-foreground tracking-tight">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={cn("mt-2 flex items-center gap-1 text-xs font-medium", trend >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400")}>
              {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{Math.abs(trend).toFixed(1)}% vs last month</span>
            </div>
          )}
        </div>
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ml-3"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
