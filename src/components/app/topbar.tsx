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
 * Topbar amigable estilo Mimo: pills coloreadas con icono + número
 * grande. Cada métrica es su propia pastilla con tinte cromático
 * sutil, feel premium gamificado.
 */
export function Topbar({ user, totalXp, streak, units }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl sm:px-6">
      <MobileSidebar units={units} />

      <div className="flex-1" />

      <div className="flex items-center gap-2 sm:gap-3">
        <StatPill
          tone="warning"
          icon={<StreakFlame streak={streak} className="size-4" />}
          value={<AnimatedNumber value={streak} />}
          unit={streak === 1 ? "día" : "días"}
          ariaLabel={`Racha de ${streak} días`}
        />
        <StatPill
          tone="primary"
          icon={<Zap className="size-4 fill-current" aria-hidden />}
          value={<AnimatedNumber value={totalXp} />}
          unit="XP"
          ariaLabel={`${totalXp} XP totales`}
        />
      </div>

      <div className="ml-1 flex items-center gap-1">
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}

function StatPill({
  tone,
  icon,
  value,
  unit,
  ariaLabel,
}: {
  tone: "primary" | "warning";
  icon: React.ReactNode;
  value: React.ReactNode;
  unit: string;
  ariaLabel: string;
}) {
  const colors =
    tone === "warning"
      ? "bg-warning-soft text-warning-foreground ring-warning/30"
      : "bg-primary/12 text-primary ring-primary/20";
  return (
    <span
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${colors}`}
    >
      {icon}
      <span className="tabular-nums">{value}</span>
      <span className="text-[11px] font-medium uppercase tracking-wider opacity-80">
        {unit}
      </span>
    </span>
  );
}
