import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getCategoryBreakdown, CATEGORY_COLORS, formatCurrency } from "@/utils/calculations";
import type { Transaction, Category } from "@/store/dashboardStore";

interface Props {
  transactions: Transaction[];
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  if (percent < 0.06) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: 11, fontWeight: 600 }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-md text-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="h-2.5 w-2.5 rounded-full inline-block" style={{ backgroundColor: item.payload.fill }} />
        <span className="font-semibold text-foreground">{item.name}</span>
      </div>
      <p className="text-muted-foreground">{formatCurrency(item.value)}</p>
    </div>
  );
};

export default function SpendingPieChart({ transactions }: Props) {
  const data = getCategoryBreakdown(transactions).slice(0, 7);

  if (!data.length) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No expense data available
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm" data-testid="spending-breakdown-chart">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Spending Breakdown</h3>
        <p className="text-xs text-muted-foreground mt-0.5">By category</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-48 h-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={90}
                innerRadius={32}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name as Category] ?? "#94a3b8"}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 w-full">
          <ul className="space-y-1.5">
            {data.map((entry) => (
              <li key={entry.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[entry.name as Category] ?? "#94a3b8" }}
                />
                <span className="flex-1 text-muted-foreground truncate">{entry.name}</span>
                <span className="font-semibold text-foreground">{formatCurrency(entry.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
