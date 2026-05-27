import { Zap } from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { StreakFlame } from "@/components/ui/streak-flame";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/app/user-menu";
import { MobileSidebar } from "@/components/app/mobile-sidebar";
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
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5"
          title={`${streak} ${streak === 1 ? "día" : "días"} de racha`}
        >
          <StreakFlame streak={streak} className="size-4" />
          <span className="font-semibold tabular-nums text-foreground">
            <AnimatedNumber value={streak} />
          </span>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            días
          </span>
        </span>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5"
          title={`${totalXp} XP`}
        >
          <Zap className="size-3.5 text-primary" aria-hidden />
          <span className="font-semibold tabular-nums text-foreground">
            <AnimatedNumber value={totalXp} />
          </span>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            XP
          </span>
        </span>
      </div>

      <div className="ml-1 flex items-center gap-1">
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
