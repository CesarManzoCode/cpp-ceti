"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, AtSign, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { checkUsernameAvailability, confirmOAuthUsername } from "@/features/profile/actions";
import { safeInternalRedirect } from "@/lib/social/redirect";
import { USERNAME_MAX, USERNAME_MIN, usernameSchema } from "@/lib/validation";

type Status =
  | { kind: "idle" }
  | { kind: "bad-format"; reason: string }
  | { kind: "checking" }
  | { kind: "ok" }
  | { kind: "taken"; reason: string };

export function ConfirmUsernameForm({ redirectTo }: { redirectTo: string | null }) {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  // Resultado async (fetch de disponibilidad), etiquetado con el valor
  // para el que se pidió — evita mostrar un resultado stale.
  const [availabilityStatus, setAvailabilityStatus] = React.useState<
    (Status & { for: string }) | null
  >(null);

  const syncStatus = React.useMemo<Status>(() => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return { kind: "idle" };
    const parsed = usernameSchema.safeParse(trimmed);
    if (!parsed.success) {
      return { kind: "bad-format", reason: parsed.error.issues[0]?.message ?? "Formato inválido" };
    }
    return { kind: "checking" };
  }, [value]);

  const status: Status =
    syncStatus.kind === "checking" && availabilityStatus && availabilityStatus.for === value.trim()
      ? availabilityStatus
      : syncStatus;

  React.useEffect(() => {
    if (syncStatus.kind !== "checking") return;
    const trimmed = value.trim();
    const handle = setTimeout(async () => {
      try {
        const result = await checkUsernameAvailability({ username: trimmed });
        setAvailabilityStatus({
          ...(result.available ? { kind: "ok" } : { kind: "taken", reason: result.reason }),
          for: trimmed,
        });
      } catch {
        // el submit re-valida server-side
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [syncStatus.kind, value]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (status.kind === "bad-format" || status.kind === "taken") return;

    startTransition(async () => {
      try {
        await confirmOAuthUsername({ username: value.trim() });
        toast.success("¡Listo! Ya puedes usar todo lo social.");
        router.push(safeInternalRedirect(redirectTo, "/app"));
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Algo salió mal");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField
        name="username"
        label="Nombre de usuario"
        error={status.kind === "bad-format" || status.kind === "taken" ? status.reason : undefined}
        hint={
          status.kind === "checking"
            ? "Verificando disponibilidad…"
            : status.kind === "ok"
              ? "Disponible"
              : "3-20 letras, números o guion bajo. No se puede cambiar después."
        }
      >
        <Input
          type="text"
          autoComplete="username"
          placeholder="cesar123"
          required
          minLength={USERNAME_MIN}
          maxLength={USERNAME_MAX}
          disabled={pending}
          leadingIcon={<AtSign className="size-4" />}
          trailing={status.kind === "ok" ? <Check className="size-4 text-success" /> : null}
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value.toLowerCase())}
        />
      </FormField>

      {error ? (
        <p className="flex items-start gap-2 border-l-2 border-destructive py-1 pl-3 text-sm text-destructive" role="alert">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        loading={pending}
        disabled={status.kind === "bad-format" || status.kind === "taken" || value.trim().length === 0}
      >
        Confirmar y continuar
      </Button>
    </form>
  );
}
