import { levelFromXp } from "@/lib/level";
import { cn } from "@/lib/utils";

/**
 * Nivel y avance hacia el siguiente. Vive dentro de una pieza, con la
 * cifra del nivel como elemento ancla y la frase de abajo diciendo
 * exactamente cuánto falta — que es la única pregunta útil aquí.
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
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-xs)]",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-[var(--radius-md)] bg-primary text-primary-foreground">
          <span className="text-[20px] font-extrabold leading-none tabular-nums">
            {lvl.level}
          </span>
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[15px] font-bold text-foreground">
              Nivel {lvl.level}
            </p>
            <p className="shrink-0 text-[13px] font-semibold tabular-nums text-muted-foreground">
              {lvl.xpInCurrentLevel} / {lvl.xpForNextLevel} XP
            </p>
          </div>
          <span
            className="mt-2 block h-2 overflow-hidden rounded-full bg-surface-3"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={lvl.xpForNextLevel}
            aria-valuenow={lvl.xpInCurrentLevel}
            aria-label={`Nivel ${lvl.level}: ${lvl.xpInCurrentLevel} de ${lvl.xpForNextLevel} XP`}
          >
            <span
              className="block h-full rounded-full bg-primary transition-[width] duration-700"
              style={{ width: `${Math.min(100, lvl.progress * 100)}%` }}
            />
          </span>
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
        Te faltan{" "}
        <span className="font-bold tabular-nums text-foreground">
          {remaining} XP
        </span>{" "}
        para llegar al nivel {lvl.level + 1}.
      </p>
    </div>
  );
}
