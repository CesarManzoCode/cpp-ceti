"use client";

import { MessageSquarePlus } from "lucide-react";

import { FeedbackDialog } from "@/features/feedback/components/feedback-dialog";

/**
 * Fila "Enviar comentario" del rail de escritorio.
 *
 * Existe como componente de cliente a propósito: cuando el `<button>` del
 * trigger se creaba en el Server Component del rail, Radix no lo pintaba
 * en el HTML del servidor (el Slot no puede clonar un elemento serializado
 * para colgarle su ref) y React rehidrataba con un desajuste, regenerando
 * todo el árbol del rail.
 */
export function FeedbackRailButton() {
  return (
    <FeedbackDialog>
      <button
        type="button"
        className="flex w-full items-center gap-2 text-[13px] font-medium text-subtle-foreground transition-colors hover:text-foreground"
      >
        <MessageSquarePlus className="size-4" aria-hidden />
        Enviar comentario
      </button>
    </FeedbackDialog>
  );
}
