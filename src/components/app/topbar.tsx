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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <MobileSidebar units={units} />

      <div className="flex-1" />

      <div className="flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1.5 text-sm">
        <Flame className="size-4 text-warning" />
        <span className="font-semibold tabular-nums">{streak}</span>
        <span className="text-xs text-muted-foreground">días</span>
      </div>

      <div className="flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1.5 text-sm">
        <Zap className="size-4 text-primary" />
        <span className="font-semibold tabular-nums">{formatNumber(totalXp)}</span>
        <span className="text-xs text-muted-foreground">XP</span>
      </div>

      <ThemeToggle />

      <UserMenu user={user} />
    </header>
  );
}
