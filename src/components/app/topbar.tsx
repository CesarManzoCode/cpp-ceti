import { Flame, Zap } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/app/user-menu";
import { MobileSidebar } from "@/components/app/mobile-sidebar";
import { formatNumber } from "@/lib/utils";
import type { SidebarUnit } from "@/components/app/sidebar-nav";

export interface TopbarProps {
  user: { name: string; email: string; image?: string | null };
  totalXp: number;
  streak: number;
  units: SidebarUnit[];
}

export function Topbar({ user, totalXp, streak, units }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl sm:px-6">
      <MobileSidebar units={units} />

      <div className="flex-1" />

      <div className="flex items-center divide-x divide-border/70 overflow-hidden rounded-full border border-border/70 bg-surface text-sm">
        <Stat
          icon={<Flame className="size-3.5" aria-hidden />}
          value={streak}
          label="días"
          tone="warning"
        />
        <Stat
          icon={<Zap className="size-3.5" aria-hidden />}
          value={formatNumber(totalXp)}
          label="XP"
          tone="primary"
        />
      </div>

      <div className="ml-1 flex items-center gap-1">
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}

function Stat({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  tone: "warning" | "primary";
}) {
  const colors =
    tone === "warning"
      ? "text-warning"
      : "text-primary";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5"
      title={`${value} ${label}`}
    >
      <span className={colors}>{icon}</span>
      <span className="font-semibold tabular-nums text-foreground">{value}</span>
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </span>
  );
}
