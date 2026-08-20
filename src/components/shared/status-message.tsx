import * as React from "react";

import { cn } from "@/lib/utils";

interface StatusMessageProps {
  /** Código corto y monoespaciado: `error 404`, `error 500`, `unidad`. */
  code: string;
  title: string;
  description?: React.ReactNode;
  /** Referencia técnica opcional (digest de Next). */
  reference?: string | null;
  tone?: "neutral" | "error";
  children?: React.ReactNode;
  className?: string;
}

/**
 * Estados de error y vacío. Se presentan como un mensaje del compilador:
 * código monoespaciado, una frase que dice qué pasó y qué se puede hacer,
 * y las acciones. Sin ilustración ni círculo de color — un error no es un
 * momento para decorar.
 */
export function StatusMessage({
  code,
  title,
  description,
  reference,
  tone = "neutral",
  children,
  className,
}: StatusMessageProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-[var(--radius-xl)] border bg-card p-6 shadow-[var(--shadow-sm)] sm:p-7",
        tone === "error" ? "border-destructive/30" : "border-border",
        className,
      )}
    >
      <p
        className={cn(
          "text-[13px] font-bold uppercase tracking-[0.06em]",
          tone === "error" ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {code}
      </p>
      <h1 className="mt-3 text-balance text-[23px] font-extrabold leading-snug tracking-[-0.028em] sm:text-[27px]">
        {title}
      </h1>
      {description ? (
        <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {reference ? (
        <p className="mt-3 font-mono text-[12px] text-subtle-foreground">
          ref: {reference}
        </p>
      ) : null}
      {children ? (
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">{children}</div>
      ) : null}
    </div>
  );
}
