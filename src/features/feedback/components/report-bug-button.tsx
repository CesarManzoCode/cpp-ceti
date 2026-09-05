"use client";

import * as React from "react";
import { Bug } from "lucide-react";

import { FeedbackDialog } from "@/features/feedback/components/feedback-dialog";
import { cn } from "@/lib/utils";

/**
 * "Reportar un bug" GENERAL (login, una página que no carga, etc.), sin
 * pasar por GitHub — la mayoría de los alumnos no sabe qué es un issue y no
 * lo abriría. Reemplaza el link que antes salía a
 * `github.com/.../issues` desde el rail y desde el perfil.
 *
 * Para contenido roto atado a un paso/ejercicio concreto está
 * `ReportBugDialog`, que vive dentro de la propia lección.
 */
export function ReportBugButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <FeedbackDialog defaultKind="bug">
      <button type="button" className={cn(className)}>
        {children}
      </button>
    </FeedbackDialog>
  );
}

/** Fila lista para usar en el rail: ícono + texto, mismo look que antes. */
export function ReportBugRailRow() {
  return (
    <ReportBugButton className="flex w-full items-center gap-2 text-[13px] font-medium text-subtle-foreground transition-colors hover:text-foreground">
      <Bug className="size-4 shrink-0" aria-hidden />
      Reportar un bug
      <span className="ml-auto tabular-nums">v0.1</span>
    </ReportBugButton>
  );
}
