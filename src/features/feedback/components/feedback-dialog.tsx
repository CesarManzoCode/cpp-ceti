"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  Bug,
  Lightbulb,
  MessageSquarePlus,
  Send,
  Sparkles,
  HelpCircle,
} from "lucide-react";
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

type Kind = "discrepancy" | "bug" | "confusing" | "idea" | "praise";

const KINDS: { value: Kind; label: string; icon: typeof HelpCircle }[] = [
  {
    value: "discrepancy",
    label: "No corresponde con mi clase",
    icon: AlertTriangle,
  },
  { value: "bug", label: "Encontré un error técnico", icon: Bug },
  { value: "confusing", label: "Algo me confundió", icon: HelpCircle },
  { value: "idea", label: "Tengo una idea", icon: Lightbulb },
  { value: "praise", label: "Algo me gustó", icon: Sparkles },
];

const COPY: Record<
  Kind,
  { title: string; description: string; placeholder: string }
> = {
  discrepancy: {
    title: "Reportar una discrepancia con tu clase",
    description:
      "¿Esta lección o unidad no corresponde con lo que tu profe está dando en clase, con el orden de tu plantel, o con el temario oficial? Es especialmente útil en semestres avanzados, donde casi no hay referencia práctica más allá del temario — y no todos los planteles lo siguen igual. Cuéntanos qué no cuadra; ya sabemos en qué pantalla estás.",
    placeholder:
      'Ej: "En mi plantel ya vimos punteros antes que arreglos, y aquí van después."',
  },
  bug: {
    title: "Reportar un error técnico",
    description:
      "¿Algo no carga, se traba, o no funciona como debería? No hace falta GitHub ni saber qué es un issue: cuéntanos qué pasó y lo revisamos. Ya sabemos en qué pantalla estás.",
    placeholder:
      'Ej: "No puedo iniciar sesión con Google, se queda cargando."',
  },
  confusing: {
    title: "¿Cómo te está yendo?",
    description:
      "Esto nos ayuda a decidir qué mejorar. Sabemos en qué pantalla estás, no hace falta que lo expliques.",
    placeholder: 'Ej: "No entendí para qué sirve el for anidado en esta lección."',
  },
  idea: {
    title: "¿Cómo te está yendo?",
    description:
      "Esto nos ayuda a decidir qué mejorar. Sabemos en qué pantalla estás, no hace falta que lo expliques.",
    placeholder: 'Ej: "Estaría bueno tener modo oscuro en el editor."',
  },
  praise: {
    title: "¿Cómo te está yendo?",
    description:
      "Esto nos ayuda a decidir qué mejorar. Sabemos en qué pantalla estás, no hace falta que lo expliques.",
    placeholder: 'Ej: "Me encantó cómo explicaron los punteros."',
  },
};

/**
 * Feedback general sobre la experiencia — incluye reportar que el contenido
 * NO corresponde con la clase real (o que una lección/unidad fue mala) y
 * reportar un error técnico general (login, una página que no carga, etc.).
 * El contexto (dónde estaba el alumno) viaja solo: mandamos la ruta y el
 * servidor la interpreta. No le pedimos que explique en qué pantalla estaba.
 *
 * Para contenido roto atado a un paso/ejercicio concreto (typo, test mal
 * configurado) existe `ReportBugDialog`. Ninguno de los dos crea un issue de
 * GitHub — la mayoría de los alumnos no sabe qué es eso y no lo usaría: caen
 * en la cola de triage interna (`/app/admin/reportes`) y un admin decide si
 * vale la pena normalizarlo como issue real.
 */
export function FeedbackDialog({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultKind = "confusing",
}: {
  children?: React.ReactNode;
  /** Modo controlado (para abrirlo desde un menú, que se cierra al elegir). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Qué opción viene preseleccionada al abrir (p. ej. "discrepancy" desde un botón dedicado). */
  defaultKind?: Kind;
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
  const [kind, setKind] = React.useState<Kind>(defaultKind);
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const pathname = usePathname();

  // Reabrir con la opción correcta preseleccionada: el diálogo del rail y el
  // de "reportar discrepancia" comparten componente pero no instancia de
  // estado si el caller lo re-monta, así que al reabrir alineamos con lo que
  // pidió el trigger en vez de arrastrar la última selección. Ajuste en
  // render (no en un efecto) siguiendo el patrón de React para "resetear
  // estado cuando cambia un prop".
  const [wasOpen, setWasOpen] = React.useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setKind(defaultKind);
  }

  const copy = COPY[kind];

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
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>{copy.description}</DialogDescription>
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
              placeholder={copy.placeholder}
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
