"use client";

import * as React from "react";
import { Flag, Send } from "lucide-react";
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
import { reportContentBug } from "@/features/bug-reports/actions";
import { BUG_REPORT_MAX_LENGTH } from "@/lib/validation";
import { cn } from "@/lib/utils";

type Target =
  | { kind: "lesson_step"; lessonStepId: string }
  | { kind: "exercise"; exerciseId: string }
  | { kind: "practice"; practiceExerciseId: string };

interface ReportBugDialogProps {
  target: Target;
  /** Disparador (botón propio del callsite). */
  children?: React.ReactNode;
}

/**
 * Diálogo para reportar un problema en el contenido (typo, test roto, etc.).
 * Acepta tres tipos de target: paso, ejercicio de lección o de práctica.
 */
export function ReportBugDialog({ target, children }: ReportBugDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const trimmed = message.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < 5;
  const tooLong = trimmed.length > BUG_REPORT_MAX_LENGTH;
  const canSubmit = trimmed.length >= 5 && !tooLong && !submitting;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await reportContentBug({ target, message: trimmed });
      toast.success("Gracias — vamos a revisarlo.");
      setMessage("");
      setOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "No pudimos enviar el reporte.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Reportar problema en este contenido"
            title="Reportar problema"
          >
            <Flag className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Reportar un problema</DialogTitle>
            <DialogDescription>
              ¿Encontraste un typo, un test mal configurado o algo que no
              cuadra? Cuéntanos qué viste y lo arreglamos.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <Label htmlFor="bug-report-message">¿Qué pasa?</Label>
            <textarea
              id="bug-report-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Ej: "El test 2 espera un espacio extra al final de la línea."'
              rows={4}
              maxLength={BUG_REPORT_MAX_LENGTH}
              aria-invalid={tooShort || tooLong || undefined}
              className={cn(
                "w-full resize-y rounded-[var(--radius-sm)] border border-input bg-surface px-3 py-2 text-sm transition-[border-color,box-shadow] focus-visible:border-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-ring)]",
                (tooShort || tooLong) && "border-destructive/60",
              )}
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>
                {tooShort
                  ? "Cuéntanos un poquito más (mínimo 5 caracteres)."
                  : tooLong
                    ? "Demasiado largo."
                    : "Sé concreto: qué viste y qué esperabas."}
              </span>
              <span className="tabular-nums">
                {trimmed.length}/{BUG_REPORT_MAX_LENGTH}
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
              Enviar reporte
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
