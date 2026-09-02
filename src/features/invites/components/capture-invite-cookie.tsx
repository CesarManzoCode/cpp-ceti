"use client";

import * as React from "react";

import { captureInviteAttribution } from "@/features/invites/actions";

/**
 * Componente invisible: en el primer render del lado del cliente, intenta
 * capturar la atribución de invitación (cookie first-touch, 30 días). Sólo
 * se monta desde `/invitar/[username]` cuando el visitante NO tiene sesión.
 */
export function CaptureInviteCookie({ inviterUsername }: { inviterUsername: string }) {
  React.useEffect(() => {
    captureInviteAttribution({ inviterUsername }).catch(() => {
      // silencioso — un fallo aquí no debe interrumpir la visita.
    });
  }, [inviterUsername]);

  return null;
}
