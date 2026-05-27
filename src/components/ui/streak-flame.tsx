import { Flame } from "lucide-react";

import { cn } from "@/lib/utils";

interface StreakFlameProps {
  /** Current streak in days. Drives flicker intensity. */
  streak: number;
  /** Tailwind size class (e.g. "size-4"). */
  className?: string;
  /** Force-disable animation (e.g. when used purely decoratively). */
  static?: boolean;
}

/**
 * Llama animada para racha. Apagada si streak === 0 (gris),
 * flicker normal si streak >= 1, flicker fuerte si streak >= 7.
 * Respeta prefers-reduced-motion automáticamente vía media query global.
 */
export function StreakFlame({
  streak,
  className,
  static: isStatic = false,
}: StreakFlameProps) {
  const lit = streak > 0;
  const strong = streak >= 7;

  return (
    <span className={cn("inline-flex", className)}>
      <Flame
        aria-hidden
        className={cn(
          "size-full",
          lit ? "text-warning" : "text-muted-foreground/40",
          !isStatic && lit && (strong ? "animate-flame-strong" : "animate-flame"),
        )}
        fill={lit ? "currentColor" : "none"}
        strokeWidth={lit ? 1.5 : 2}
      />
    </span>
  );
}
