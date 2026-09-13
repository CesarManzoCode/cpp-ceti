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
/**
 * ============================================================
 * GRAMÁTICA DE PROGRESO (blueprint UX/UI, sección G5)
 * ============================================================
 *
 * `BrickRow` es un objeto legible mientras la secuencia quepa de un
 * vistazo. Más allá de eso deja de informar y se vuelve un código de
 * barras decorativo — exactamente lo que el blueprint prohíbe para 68,
 * 80 o 92 elementos. `ProgressSequence` decide la representación por
 * cardinalidad y nunca dibuja más de 24 bloques:
 *
 *  ·  1        → estado de texto
 *  ·  2–12     → bloques discretos (BrickRow)
 *  · 13–24     → segmentos agrupados (menos bloques, cada uno = varias unidades)
 *  · >24       → barra proporcional + cuenta exacta + porcentaje
 */
export function ProgressSequence({
  total,
  done,
  label,
  tone = "primary",
  className,
}: {
  total: number;
  done: number;
  /** Sustantivo de lo que se cuenta, en plural: "lecciones", "ejercicios". */
  label: string;
  tone?: "primary" | "success";
  className?: string;
}) {
  const safeTotal = Math.max(0, total);
  const safeDone = Math.min(Math.max(0, done), safeTotal);
  const percent = safeTotal === 0 ? 0 : Math.round((safeDone / safeTotal) * 100);
  const srLabel = `${safeDone} de ${safeTotal} ${label}, ${percent}%`;

  if (safeTotal <= 1) {
    const text =
      safeTotal === 0
        ? "Sin contenido"
        : safeDone >= safeTotal
          ? "Completada"
          : safeDone > 0
            ? "En curso"
            : "Sin empezar";
    return (
      <span className={cn("text-[13px] font-semibold text-muted-foreground", className)}>
        {text}
      </span>
    );
  }

  if (safeTotal <= 12) {
    return (
      <div className={cn("flex items-center gap-2.5", className)}>
        <BrickRow
          className="min-w-0 flex-1"
          total={safeTotal}
          done={safeDone}
          tone={tone}
          srLabel={srLabel}
        />
        <span className="shrink-0 text-[13px] font-semibold tabular-nums text-muted-foreground">
          {safeDone}/{safeTotal}
        </span>
      </div>
    );
  }

  if (safeTotal <= 24) {
    // Segmentos agrupados: como máximo 12 bloques, cada uno representa un
    // tramo proporcional de la secuencia completa (no un elemento a la vez).
    const segments = 12;
    const perSegment = safeTotal / segments;
    return (
      <div className={cn("flex items-center gap-2.5", className)}>
        <div
          role="img"
          aria-label={srLabel}
          className="flex min-w-0 flex-1 items-center gap-1"
        >
          {Array.from({ length: segments }, (_, i) => {
            const segmentDone = Math.min(
              1,
              Math.max(0, safeDone / perSegment - i),
            );
            return (
              <span
                key={i}
                aria-hidden
                className="h-1.5 flex-1 overflow-hidden rounded-[2px] bg-surface-3"
              >
                <span
                  className={cn(
                    "block h-full",
                    tone === "success" ? "bg-success" : "bg-primary",
                  )}
                  style={{ width: `${segmentDone * 100}%` }}
                />
              </span>
            );
          })}
        </div>
        <span className="shrink-0 text-[13px] font-semibold tabular-nums text-muted-foreground">
          {safeDone}/{safeTotal}
        </span>
      </div>
    );
  }

  // >24: barra proporcional. Nunca un nodo por elemento.
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-valuenow={safeDone}
        aria-label={srLabel}
        className="block h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-3"
      >
        <span
          className={cn(
            "block h-full rounded-full transition-[width] duration-500 ease-out",
            tone === "success" ? "bg-success" : "bg-primary",
          )}
          style={{ width: `${percent}%` }}
        />
      </span>
      <span className="shrink-0 text-[13px] font-semibold tabular-nums text-muted-foreground">
        {safeDone}/{safeTotal} · {percent}%
      </span>
    </div>
  );
}

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
