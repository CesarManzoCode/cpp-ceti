import { Flame } from "lucide-react";

import { cn } from "@/lib/utils";

interface StreakFlameProps {
  /** Current streak in days. */
  streak: number;
  /** Tailwind size class (e.g. "size-4"). */
  className?: string;
}

/**
 * Ícono de racha. Apagada (gris) si streak === 0, encendida (ámbar) si
 * streak >= 1. Sin parpadeo: el blueprint de UX/UI prohíbe animación
 * continua en reposo — "el estado 'estás aquí', la llama y los
 * indicadores quedan inmóviles". La racha se lee por número, no por
 * movimiento.
 */
export function StreakFlame({ streak, className }: StreakFlameProps) {
  const lit = streak > 0;

  return (
    <span className={cn("inline-flex", className)}>
      <Flame
        aria-hidden
        className={cn("size-full", lit ? "text-warning" : "text-muted-foreground/55")}
        fill={lit ? "currentColor" : "none"}
        strokeWidth={lit ? 1.5 : 1.85}
      />
    </span>
  );
}
