import { levelFromXp } from "@/lib/level";
import { cn } from "@/lib/utils";

/**
 * Nivel como anillo: el número dentro, el avance hacia el siguiente
 * nivel alrededor. Ocupa lo mismo que un icono, así que cabe en la
 * barra superior sin convertirse en una tarjeta de métricas.
 */
export function LevelRing({
  totalXp,
  className,
  size = 30,
}: {
  totalXp: number;
  className?: string;
  size?: number;
}) {
  const lvl = levelFromXp(totalXp);
  const r = 13;
  const c = 2 * Math.PI * r;
  const filled = Math.min(1, Math.max(0, lvl.progress));

  return (
    <span
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size }}
      aria-label={`Nivel ${lvl.level}, ${lvl.xpInCurrentLevel} de ${lvl.xpForNextLevel} XP`}
    >
      <svg viewBox="0 0 32 32" className="absolute inset-0 size-full -rotate-90">
        <circle
          cx="16"
          cy="16"
          r={r}
          fill="none"
          stroke="var(--surface-3)"
          strokeWidth="3"
        />
        <circle
          cx="16"
          cy="16"
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${c * filled} ${c}`}
          className="transition-[stroke-dasharray] duration-700"
        />
      </svg>
      <span
        aria-hidden
        className="relative text-[11px] font-extrabold tabular-nums leading-none text-foreground"
      >
        {lvl.level}
      </span>
    </span>
  );
}
