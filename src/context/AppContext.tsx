import { createContext, useContext, type ReactNode } from "react";
import { useDashboardStore, type DashboardStore } from "@/store/dashboardStore";

const AppContext = createContext<DashboardStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const store = useDashboardStore();
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
}

export function useApp(): DashboardStore {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
