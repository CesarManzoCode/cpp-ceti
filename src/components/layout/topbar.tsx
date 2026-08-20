import { AnimatedNumber } from "@/components/ui/animated-number";
import { StreakFlame } from "@/components/ui/streak-flame";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { TopbarLocation } from "@/components/layout/topbar-location";
import { levelFromXp } from "@/lib/level";
import type { RoadmapUnit } from "@/features/roadmap/types";

export interface TopbarProps {
  user: { name: string; email: string; image?: string | null; username: string };
  totalXp: number;
  streak: number;
  units: RoadmapUnit[];
  pendingFriendsCount?: number;
}

/**
 * Barra superior. Las tres medidas del alumno (racha, nivel, XP) se leen
 * como la línea de estado de un editor: monoespaciadas, tabulares, con
 * la etiqueta en versalitas. Son indicadores, no botones — por eso no
 * tienen relleno ni borde propio.
 */
export function Topbar({
  user,
  totalXp,
  streak,
  units,
  pendingFriendsCount = 0,
}: TopbarProps) {
  const lvl = levelFromXp(totalXp);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur-sm sm:px-5">
      <MobileSidebar units={units} pendingFriendsCount={pendingFriendsCount} />

      <TopbarLocation units={units} />

      <div className="min-w-2 flex-1" />

      <div
        className="flex items-center gap-3 sm:gap-4"
        aria-label="Tus métricas"
      >
        <Metric
          label="racha"
          mark={<StreakFlame streak={streak} className="size-3.5" />}
          value={
            <>
              <AnimatedNumber value={streak} />
              <span className="text-muted-foreground">d</span>
            </>
          }
          srLabel={`Racha de ${streak} ${streak === 1 ? "día" : "días"}`}
        />

        <span aria-hidden className="h-4 w-px bg-border" />

        <span
          className="flex items-center gap-2"
          aria-label={`Nivel ${lvl.level}, ${lvl.xpInCurrentLevel} de ${lvl.xpForNextLevel} XP`}
        >
          <span className="label-micro hidden text-muted-foreground sm:inline">
            nivel
          </span>
          <span className="font-mono text-[13px] font-medium tabular-nums text-foreground">
            {lvl.level}
          </span>
          <span
            className="hidden h-1 w-12 overflow-hidden bg-surface-3 sm:block"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={lvl.xpForNextLevel}
            aria-valuenow={lvl.xpInCurrentLevel}
          >
            <span
              className="block h-full bg-primary transition-[width] duration-500"
              style={{ width: `${Math.min(100, lvl.progress * 100)}%` }}
            />
          </span>
        </span>

        <span aria-hidden className="h-4 w-px bg-border" />

        <Metric
          label="xp"
          value={<AnimatedNumber value={totalXp} />}
          srLabel={`${totalXp} XP totales`}
        />
      </div>

      <div className="ml-1 flex items-center gap-0.5 sm:ml-3">
        <ThemeToggle />
        <UserMenu user={user} pendingFriendsCount={pendingFriendsCount} />
      </div>
    </header>
  );
}

function Metric({
  label,
  value,
  mark,
  srLabel,
}: {
  label: string;
  value: React.ReactNode;
  mark?: React.ReactNode;
  srLabel: string;
}) {
  return (
    <span className="flex items-center gap-1.5" aria-label={srLabel}>
      {mark}
      <span className="label-micro hidden text-muted-foreground sm:inline">
        {label}
      </span>
      <span className="font-mono text-[13px] font-medium tabular-nums text-foreground">
        {value}
      </span>
    </span>
  );
}
