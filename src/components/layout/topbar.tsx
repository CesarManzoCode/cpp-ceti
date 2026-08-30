import { AnimatedNumber } from "@/components/ui/animated-number";
import { LevelRing } from "@/components/ui/level-ring";
import { StreakFlame } from "@/components/ui/streak-flame";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { TopbarLocation } from "@/components/layout/topbar-location";
import type { RoadmapUnit } from "@/features/roadmap/types";

export interface TopbarProps {
  user: { name: string; email: string; image?: string | null; username: string };
  totalXp: number;
  streak: number;
  units: RoadmapUnit[];
  pendingFriendsCount?: number;
  /** Muestra el acceso al panel interno (la autorización es server-side). */
  isAdmin?: boolean;
}

/**
 * Barra superior. Sólo tres cosas: dónde estoy, qué llevo acumulado y
 * mi cuenta. Las medidas son fichas pequeñas — apoyan, no gobiernan.
 */
export function Topbar({
  user,
  totalXp,
  streak,
  units,
  pendingFriendsCount = 0,
  isAdmin = false,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6">
      <TopbarLocation units={units} />

      <div className="min-w-2 flex-1" />

      <div className="flex items-center gap-2 sm:gap-2.5">
        <span
          className="flex items-center gap-1.5 rounded-full bg-warning-soft px-2.5 py-1.5 text-[13px] font-bold tabular-nums text-warning"
          aria-label={`Racha de ${streak} ${streak === 1 ? "día" : "días"}`}
        >
          <StreakFlame streak={streak} className="size-4" />
          <AnimatedNumber value={streak} />
          <span className="hidden font-semibold sm:inline">
            {streak === 1 ? "día" : "días"}
          </span>
        </span>

        <span
          className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-[13px] font-bold tabular-nums text-foreground"
          aria-label={`${totalXp} XP totales`}
        >
          <LevelRing totalXp={totalXp} size={26} />
          <span>
            <AnimatedNumber value={totalXp} />
            <span className="ml-1 text-subtle-foreground">XP</span>
          </span>
        </span>
      </div>

      <div className="ml-1 flex items-center gap-0.5 sm:ml-2">
        <ThemeToggle />
        <UserMenu
          user={user}
          pendingFriendsCount={pendingFriendsCount}
          isAdmin={isAdmin}
        />
      </div>
    </header>
  );
}
