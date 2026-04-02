import { Menu, ChevronDown, Shield, Eye } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Role } from "@/store/dashboardStore";

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export default function Header({ onMenuClick, title }: HeaderProps) {
  const { role, setRole } = useApp();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as Role);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur-sm px-4 lg:px-6">
      <button
        className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
        onClick={onMenuClick}
        data-testid="header-menu-button"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="text-lg font-semibold flex-1">{title}</h1>

      <div className="flex items-center gap-2">
        <div className="relative flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground border border-border">
          {role === "admin" ? (
            <Shield className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <select
            value={role}
            onChange={handleRoleChange}
            data-testid="role-selector"
            className="appearance-none bg-transparent pr-4 focus:outline-none cursor-pointer text-foreground"
          >
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          <ChevronDown className="h-3 w-3 pointer-events-none absolute right-2" />
        </div>
      </div>
    </header>
  );
}
