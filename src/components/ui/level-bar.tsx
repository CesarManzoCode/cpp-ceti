import { levelFromXp } from "@/lib/level";
import { cn } from "@/lib/utils";

/**
 * Nivel y avance hacia el siguiente. Se lee como una regla graduada:
 * `NV 04` en mono a la izquierda, la barra al centro y el conteo de XP
 * a la derecha. Misma gramática que la barra superior de la app.
 */
export function LevelBar({
  totalXp,
  className,
}: {
  totalXp: number;
  className?: string;
}) {
  const lvl = levelFromXp(totalXp);
  const remaining = lvl.xpForNextLevel - lvl.xpInCurrentLevel;

  return (
    <div className={cn("border-y border-border py-4", className)}>
      <div className="flex items-center gap-4">
        <span className="flex shrink-0 items-baseline gap-1.5">
          <span className="label-micro text-muted-foreground">nivel</span>
          <span className="font-mono text-[22px] font-medium leading-none tabular-nums text-foreground">
            {String(lvl.level).padStart(2, "0")}
          </span>
        </span>

        <span
          className="h-1 flex-1 overflow-hidden bg-surface-3"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={lvl.xpForNextLevel}
          aria-valuenow={lvl.xpInCurrentLevel}
          aria-label={`Nivel ${lvl.level}: ${lvl.xpInCurrentLevel} de ${lvl.xpForNextLevel} XP`}
        >
          <span
            className="block h-full bg-primary transition-[width] duration-500"
            style={{ width: `${Math.min(100, lvl.progress * 100)}%` }}
          />
        </span>

        <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
          {lvl.xpInCurrentLevel}/{lvl.xpForNextLevel} XP
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Te faltan{" "}
        <span className="font-mono tabular-nums text-foreground">
          {remaining} XP
        </span>{" "}
        para el nivel {lvl.level + 1}.
      </p>
    </div>
  );
}
