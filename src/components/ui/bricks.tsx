import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * ============================================================
 * LOS BLOQUES — el elemento firma de C++ CETI
 * ============================================================
 *
 * Un programa se construye instrucción por instrucción. El curso
 * también: cada lección es un bloque, cada unidad es un módulo de
 * bloques, y el curso completo es la columna que vas levantando.
 *
 * El mismo objeto aparece en tres escalas:
 *
 *  · `BrickRow`    — la unidad de un vistazo (portada, cabecera de unidad)
 *  · `BrickColumn` — el recorrido del curso (la ruta del temario)
 *  · `BrickRow`    — los pasos dentro de una lección (reproductor)
 *
 * Un bloque colocado es sólido; uno pendiente es hueco; el que estás
 * poniendo ahora mismo tiene un anillo. La forma distingue los tres
 * estados aunque no se vea el color.
 */

export type BrickState = "done" | "current" | "todo" | "locked";

const rowTone: Record<BrickState, string> = {
  done: "bg-primary",
  current: "bg-primary ring-2 ring-[var(--primary-ring)]",
  todo: "bg-surface-3",
  locked: "bg-surface-3 opacity-55",
};

const rowToneSuccess: Record<BrickState, string> = {
  ...rowTone,
  done: "bg-success",
};

interface BrickRowProps extends Omit<React.ComponentProps<"div">, "children"> {
  total: number;
  /** Cuántos bloques ya están colocados. */
  done: number;
  /** Índice (base 0) del bloque en curso. -1 para ninguno. */
  current?: number;
  /** Bloques a partir de este índice se dibujan bloqueados. */
  lockedFrom?: number;
  size?: "sm" | "md" | "lg";
  tone?: "primary" | "success";
  /** Texto para lectores de pantalla. */
  srLabel?: string;
}

const rowSize = {
  sm: "h-1.5 gap-[3px]",
  md: "h-2 gap-1",
  lg: "h-2.5 gap-1",
} as const;

export function BrickRow({
  total,
  done,
  current = -1,
  lockedFrom,
  size = "md",
  tone = "primary",
  srLabel,
  className,
  ...props
}: BrickRowProps) {
  const safeTotal = Math.max(1, total);
  const palette = tone === "success" ? rowToneSuccess : rowTone;

  return (
    <div
      role="img"
      aria-label={srLabel ?? `${done} de ${safeTotal} completados`}
      className={cn("flex items-center", rowSize[size], className)}
      {...props}
    >
      {Array.from({ length: safeTotal }, (_, i) => {
        const state: BrickState =
          i < done
            ? "done"
            : i === current
              ? "current"
              : lockedFrom !== undefined && i >= lockedFrom
                ? "locked"
                : "todo";
        return (
          <span
            key={i}
            aria-hidden
            className={cn(
              "h-full min-w-[3px] flex-1 rounded-[2px] transition-colors duration-300",
              palette[state],
            )}
          />
        );
      })}
    </div>
  );
}

interface BrickColumnProps extends Omit<React.ComponentProps<"div">, "children"> {
  total: number;
  done: number;
  /** Índice (base 0) del bloque en curso dentro de esta columna. */
  current?: number;
  locked?: boolean;
  tone?: "primary" | "success";
}

/**
 * La misma idea en vertical: se usa en la ruta del curso, donde cada
 * columna es una unidad y se apila con las demás formando el recorrido
 * completo. Los bloques crecen para ocupar el alto de la fila, así que
 * una unidad larga se ve — literalmente — más larga.
 */
export function BrickColumn({
  total,
  done,
  current = -1,
  locked = false,
  tone = "primary",
  className,
  ...props
}: BrickColumnProps) {
  const safeTotal = Math.max(1, total);
  const palette = tone === "success" ? rowToneSuccess : rowTone;

  return (
    <div
      aria-hidden
      className={cn("flex w-2.5 flex-col items-stretch gap-1", className)}
      {...props}
    >
      {Array.from({ length: safeTotal }, (_, i) => {
        const state: BrickState = locked
          ? "locked"
          : i < done
            ? "done"
            : i === current
              ? "current"
              : "todo";
        return (
          <span
            key={i}
            className={cn(
              "min-h-[5px] w-full flex-1 rounded-[2px] transition-colors duration-300",
              state === "current" ? "bg-primary" : palette[state],
            )}
          />
        );
      })}
    </div>
  );
}
