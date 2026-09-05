"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/features/feedback/components/feedback-dialog";

/**
 * Botón dedicado para reportar que el contenido NO corresponde con la clase
 * real, o que una lección/unidad fue mala — sin pasar por GitHub. Reusa el
 * mismo modelo (`Feedback`) y la misma cola de triage que "Enviar
 * comentario"; sólo cambia la opción que viene preseleccionada al abrir.
 *
 * Vive junto al `ReportBugDialog` en la cabecera de la lección y en la
 * página de unidad: el alumno lo ve exactamente donde nota el problema, sin
 * tener que buscarlo en un menú aparte. Estilo llamativo (no `ghost`) a
 * propósito — un ícono apagado entre otros íconos apagados nunca se nota, y
 * esto es justo lo que más nos importa saber en semestres avanzados, donde
 * el temario oficial casi no tiene referencia práctica y cada plantel lo
 * sigue distinto.
 */
export function ReportDiscrepancyButton() {
  return (
    <FeedbackDialog defaultKind="discrepancy">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="Reportar que esto no corresponde con tu clase o tu plantel"
        title="¿No corresponde con tu clase o tu plantel?"
        className="gap-1.5 rounded-full border border-warning/40 bg-warning-soft px-2.5 text-warning hover:border-warning/60 hover:bg-warning-soft hover:text-warning hover:brightness-95"
      >
        <AlertTriangle className="size-4" aria-hidden />
        <span className="hidden sm:inline">¿No es tu clase?</span>
      </Button>
    </FeedbackDialog>
  );
}
