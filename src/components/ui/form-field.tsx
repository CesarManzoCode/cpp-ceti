"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  /** Identificador del control (también funciona como `htmlFor` del label). */
  name: string;
  label: string;
  /** Mensaje de error específico de este campo. */
  error?: string | null;
  /** Hint informativo cuando no hay error. */
  hint?: string;
  /** Si true, oculta el label visualmente pero lo mantiene para a11y. */
  hideLabel?: boolean;
  /** El control real (Input, PasswordInput, textarea, etc.). */
  children: React.ReactElement<{
    id?: string;
    name?: string;
    "aria-invalid"?: boolean | "true" | "false";
    "aria-describedby"?: string;
  }>;
  className?: string;
}

/**
 * Envoltorio mínimo Label + control + mensaje de error/hint con las aria
 * relacionadas conectadas. No usa react-hook-form: cada form maneja su propio
 * estado (los nuestros son pequeños) y FormField se encarga de la a11y.
 */
export function FormField({
  name,
  label,
  error,
  hint,
  hideLabel,
  children,
  className,
}: FormFieldProps) {
  const errorId = error ? `${name}-error` : undefined;
  const hintId = hint && !error ? `${name}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  const enhanced = React.cloneElement(children, {
    id: name,
    name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  });

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={name} className={cn(hideLabel && "sr-only")}>
        {label}
      </Label>
      {enhanced}
      {error ? (
        <p
          id={errorId}
          className="animate-fade-in flex items-start gap-1.5 text-xs font-medium text-destructive"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-3 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Helper: convierte issues de un `safeParse` fallido en un map
 * `{ campoNombre: mensaje }` para alimentar a `<FormField error={...}>`.
 */
export function zodIssuesToFieldErrors(
  issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) {
      out[key] = issue.message;
    }
  }
  return out;
}
