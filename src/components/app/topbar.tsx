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
 * Topbar editorial — labels en bracket monospace, sin pills genéricas.
 * Cada métrica es una etiqueta `[ LABEL ] VALOR` que se siente
 * más IDE / report que dashboard.
 */
export function Topbar({ user, totalXp, streak, units }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl sm:px-6">
      <MobileSidebar units={units} />

      <div className="flex-1" />

      <div className="hidden items-center gap-5 sm:flex">
        <Stat label="streak">
          <StreakFlame streak={streak} className="size-3.5" />
          <span className="font-mono text-[13px] font-bold tabular-nums text-foreground">
            <AnimatedNumber value={streak} />
            <span className="ml-0.5 text-[0.7em] text-muted-foreground">
              d
            </span>
          </span>
        </Stat>
        <span aria-hidden className="h-4 w-px bg-border" />
        <Stat label="xp">
          <span className="font-mono text-[13px] font-bold tabular-nums text-foreground">
            <AnimatedNumber value={totalXp} />
          </span>
        </Stat>
      </div>

      <div className="ml-1 flex items-center gap-1">
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}

function Stat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden
        className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70"
      >
        [{label}]
      </span>
      {children}
    </span>
  );
}
