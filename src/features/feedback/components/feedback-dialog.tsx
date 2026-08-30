"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Lightbulb, MessageSquarePlus, Send, Sparkles, HelpCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { submitFeedback } from "@/features/feedback/actions";
import { FEEDBACK_MAX_LENGTH } from "@/features/feedback/context";
import { cn } from "@/lib/utils";

type Kind = "confusing" | "idea" | "praise";

const KINDS: { value: Kind; label: string; icon: typeof HelpCircle }[] = [
  { value: "confusing", label: "Algo me confundió", icon: HelpCircle },
  { value: "idea", label: "Tengo una idea", icon: Lightbulb },
  { value: "praise", label: "Algo me gustó", icon: Sparkles },
];

/**
 * Feedback general sobre la experiencia. El contexto (dónde estaba el
 * alumno) viaja solo: mandamos la ruta y el servidor la interpreta. No le
 * pedimos que explique en qué pantalla estaba.
 *
 * Para contenido roto (typo, test mal configurado) existe `ReportBugDialog`,
 * que sí apunta a un paso/ejercicio concreto.
 */
export function FeedbackDialog({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children?: React.ReactNode;
  /** Modo controlado (para abrirlo desde un menú, que se cierra al elegir). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (isControlled) onOpenChange?.(next);
      else setUncontrolledOpen(next);
    },
    [isControlled, onOpenChange],
  );
  const [kind, setKind] = React.useState<Kind>("confusing");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const pathname = usePathname();

  const trimmed = message.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < 5;
  const canSubmit =
    trimmed.length >= 5 && trimmed.length <= FEEDBACK_MAX_LENGTH && !submitting;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await submitFeedback({ kind, message: trimmed, path: pathname });
      toast.success("Gracias — lo leemos todo.");
      setMessage("");
      setOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "No pudimos enviar tu comentario.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isControlled ? null : (
        <DialogTrigger asChild>
          {children ?? (
            <Button type="button" variant="ghost" size="sm">
              <MessageSquarePlus className="size-4" />
              Enviar comentario
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>¿Cómo te está yendo?</DialogTitle>
            <DialogDescription>
              Esto nos ayuda a decidir qué mejorar. Sabemos en qué pantalla
              estás, no hace falta que lo expliques.
            </DialogDescription>
          </DialogHeader>

          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Tipo de comentario"
          >
            {KINDS.map((option) => {
              const active = kind === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setKind(option.value)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-[14px] font-semibold transition-colors",
                    active
                      ? "border-primary bg-primary-tint text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/45 hover:text-foreground",
                  )}
                >
                  <option.icon className="size-4" aria-hidden />
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="feedback-message">Cuéntanos</Label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Ej: "No entendí para qué sirve el for anidado en esta lección."'
              rows={4}
              maxLength={FEEDBACK_MAX_LENGTH}
              aria-invalid={tooShort || undefined}
              className={cn(
                "w-full resize-y rounded-[var(--radius-xs)] border border-input bg-surface px-3 py-2 text-base transition-[border-color,box-shadow] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-ring)] sm:text-sm",
                tooShort && "border-destructive/60",
              )}
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>
                {tooShort
                  ? "Un poquito más de contexto, por favor."
                  : "Entre más concreto, más fácil de arreglar."}
              </span>
              <span className="tabular-nums">
                {trimmed.length}/{FEEDBACK_MAX_LENGTH}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={submitting} disabled={!canSubmit}>
              <Send />
              Enviar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
