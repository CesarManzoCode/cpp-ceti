import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

/**
 * Piezas compartidas por todos los tipos de paso. Un quiz, un
 * "completa el código" y un reto tienen que sentirse el mismo objeto:
 * misma ficha de tipo arriba, mismo pie de acciones abajo y el mismo
 * lenguaje de veredicto.
 */

type StepTone = "primary" | "info" | "warning" | "success";

const stepToneClass: Record<StepTone, string> = {
  primary: "bg-primary-soft text-primary-soft-foreground",
  info: "bg-info-soft text-info",
  warning: "bg-warning-soft text-warning",
  success: "bg-success-soft text-success",
};

/**
 * Ficha de tipo de paso. Dice en una palabra qué se espera del alumno
 * aquí: leer, contestar, completar, programar.
 */
export function StepKind({
  label,
  icon,
  tone = "primary",
  className,
}: {
  label: string;
  icon?: React.ReactNode;
  tone?: StepTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.05em] [&_svg]:size-3.5",
        stepToneClass[tone],
        className,
      )}
    >
      {icon}
      {label}
    </span>
  );
}

export function StepHeader({
  label,
  icon,
  tone = "primary",
  children,
  className,
}: {
  label: string;
  icon?: React.ReactNode;
  tone?: StepTone;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("space-y-4", className)}>
      <StepKind label={label} icon={icon} tone={tone} />
      {children}
    </header>
  );
}

/**
 * Pie del paso. En móvil se queda pegado abajo, al alcance del pulgar,
 * para que "continuar" nunca se pierda tras un bloque de código largo.
 * En escritorio vuelve al flujo, separado por un filete.
 */
export function StepActions({
  hint,
  leading,
  children,
  className,
}: {
  /** Texto del atajo, p. ej. "para continuar". Sólo con teclado. */
  hint?: string;
  /** Acción secundaria alineada a la izquierda (ver solución, corregir…). */
  leading?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border bg-background/95 px-4 py-3.5 backdrop-blur-md",
        "pb-[max(0.875rem,env(safe-area-inset-bottom))]",
        "sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-6 sm:backdrop-blur-none",
        "[&>*]:max-sm:flex-1 [&_button]:max-sm:w-full [&_a]:max-sm:w-full",
        className,
      )}
    >
      {leading}
      <div className="ml-auto flex items-center gap-3 max-sm:w-full">
        {hint ? (
          <span className="hidden items-center gap-1.5 text-[13px] text-muted-foreground sm:inline-flex">
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

const verdictTone: Record<
  VerdictTone,
  { box: string; label: string; icon: React.ReactNode }
> = {
  correct: {
    box: "border-success/30 bg-success-soft/60",
    label: "text-success",
    icon: <CheckCircle2 aria-hidden />,
  },
  wrong: {
    box: "border-destructive/30 bg-destructive-soft/60",
    label: "text-destructive",
    icon: <XCircle aria-hidden />,
  },
  hint: {
    box: "border-warning/30 bg-warning-soft/60",
    label: "text-warning",
    icon: <AlertTriangle aria-hidden />,
  },
  neutral: {
    box: "border-border bg-surface-2",
    label: "text-muted-foreground",
    icon: <Info aria-hidden />,
  },
};

/**
 * Veredicto del paso. El icono y la palabra llevan el significado; el
 * color sólo lo refuerza, así que se entiende igual sin verlo.
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
      className={cn(
        "rounded-[var(--radius-lg)] border p-4 sm:p-5",
        t.box,
        className,
      )}
      {...props}
    >
      <p
        className={cn(
          "flex items-center gap-2 text-[15px] font-bold [&_svg]:size-[18px] [&_svg]:shrink-0",
          t.label,
        )}
      >
        {icon ?? t.icon}
        {title}
      </p>
      {children ? (
        <div className="mt-2.5 text-[15px] leading-relaxed text-foreground [&_.reading]:text-[15px] [&_.reading]:leading-relaxed">
          {children}
        </div>
      ) : null}
    </div>
  );
}
