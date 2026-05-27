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

/**
 * Topbar editorial: lectura discreta de las dos métricas clave
 * (racha + XP) en estilo sobrio — no son botones, son indicadores.
 */
export function Topbar({ user, totalXp, streak, units }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl sm:px-6">
      <MobileSidebar units={units} />

      <div className="flex-1" />

      <div
        className="flex items-center divide-x divide-border/70 text-sm"
        aria-label="Métricas"
      >
        <span
          className="flex items-center gap-2 pr-4"
          aria-label={`Racha de ${streak} ${streak === 1 ? "día" : "días"}`}
        >
          <StreakFlame streak={streak} className="size-4" />
          <span className="tabular-nums font-semibold text-foreground">
            <AnimatedNumber value={streak} />
          </span>
          <span className="hidden text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:inline">
            {streak === 1 ? "día" : "días"}
          </span>
        </span>

        <span
          className="flex items-center gap-2 pl-4"
          aria-label={`${totalXp} XP totales`}
        >
          <Zap className="size-4 text-primary" aria-hidden />
          <span className="tabular-nums font-semibold text-foreground">
            <AnimatedNumber value={totalXp} />
          </span>
          <span className="hidden text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:inline">
            XP
          </span>
        </span>
      </div>

      <div className="ml-3 flex items-center gap-1">
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
