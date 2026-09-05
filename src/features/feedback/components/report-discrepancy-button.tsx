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
 * tener que buscarlo en un menú aparte.
 */
export function ReportDiscrepancyButton() {
  return (
    <FeedbackDialog defaultKind="discrepancy">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Reportar que esto no corresponde con tu clase"
        title="¿No corresponde con tu clase?"
      >
        <AlertTriangle className="size-4" />
      </Button>
    </FeedbackDialog>
  );
}
