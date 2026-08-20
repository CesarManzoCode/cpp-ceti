import * as React from "react";

import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

/**
 * Piezas compartidas por todos los tipos de paso, para que un quiz, un
 * "completa el código" y un reto se sientan el mismo objeto: misma
 * etiqueta arriba, mismo pie de acciones abajo, mismo lenguaje de
 * veredicto.
 */

export function StepHeader({
  label,
  children,
  className,
}: {
  label: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("space-y-3", className)}>
      <p className="label-micro text-primary">{label}</p>
      {children}
    </header>
  );
}

/**
 * Pie del paso: filete, atajo de teclado a la izquierda (sólo desktop,
 * donde hay teclado) y las acciones a la derecha.
 */
export function StepActions({
  hint,
  leading,
  children,
  className,
}: {
  /** Texto del atajo, p. ej. "para continuar". Si no hay, no se muestra. */
  hint?: string;
  /** Acción secundaria alineada a la izquierda (ver solución, corregir…). */
  leading?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-5",
        className,
      )}
    >
      {leading}
      <div className="ml-auto flex items-center gap-3">
        {hint ? (
          <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
            <Kbd>Enter</Kbd>
            {hint}
          </span>
        ) : null}
        {children}
      </div>
    </div>
  );
}

type VerdictTone = "correct" | "wrong" | "hint" | "neutral";

const verdictTone: Record<VerdictTone, { rule: string; label: string }> = {
  correct: { rule: "border-success", label: "text-success" },
  wrong: { rule: "border-destructive", label: "text-destructive" },
  hint: { rule: "border-warning", label: "text-warning" },
  neutral: { rule: "border-border-strong", label: "text-muted-foreground" },
};

/**
 * Veredicto del paso: una regla de color a la izquierda y el texto al
 * lado. No es una tarjeta de colores — el mensaje del compilador o del
 * quiz es texto, y el color sólo dice de qué tipo es.
 */
export function Verdict({
  tone,
  title,
  icon,
  children,
  className,
  ...props
}: {
  tone: VerdictTone;
  title: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
} & Omit<React.ComponentProps<"div">, "title">) {
  const t = verdictTone[tone];
  return (
    <div
      role="status"
      className={cn("border-l-2 py-1 pl-4", t.rule, className)}
      {...props}
    >
      <p className={cn("label-micro flex items-center gap-1.5", t.label)}>
        {icon}
        {title}
      </p>
      {children ? (
        <div className="mt-2 text-[15px] leading-relaxed text-foreground/90">
          {children}
        </div>
      ) : null}
    </div>
  );
}
