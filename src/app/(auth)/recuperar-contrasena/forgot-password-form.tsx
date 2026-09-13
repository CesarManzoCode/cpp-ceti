"use client";

import * as React from "react";
import { AlertCircle, Mail, MailCheck } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FormField, focusFirstError, zodIssuesToFieldErrors } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Tu correo es obligatorio").email("Correo inválido"),
});

type FieldErrors = Partial<Record<"email", string>>;

/**
 * No confirma ni desmiente si el correo existe: el mensaje de éxito es
 * siempre el mismo, exista la cuenta o no. Evita que este form sirva para
 * enumerar cuentas registradas.
 */
export function ForgotPasswordForm() {
  const [isPending, startTransition] = React.useTransition();
  const [formError, setFormError] = React.useState<string | null>(null);
  const [errorNonce, setErrorNonce] = React.useState(0);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [sent, setSent] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const parsed = forgotPasswordSchema.safeParse({
      email: String(formData.get("email") ?? "").trim(),
    });
    if (!parsed.success) {
      const errors = zodIssuesToFieldErrors(parsed.error.issues);
      setFieldErrors(errors);
      focusFirstError(errors);
      return;
    }

    startTransition(async () => {
      const { error } = await authClient.requestPasswordReset({
        email: parsed.data.email,
        redirectTo: "/restablecer-contrasena",
      });

      if (error) {
        setFormError(
          error.message ?? "No pudimos procesar la solicitud. Intenta de nuevo.",
        );
        setErrorNonce((n) => n + 1);
        return;
      }

      setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="animate-fade-in flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-surface-2 p-6 text-center">
        <MailCheck className="size-8 text-primary" aria-hidden />
        <p className="text-[15px] font-semibold text-foreground">
          Revisa tu correo
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Si hay una cuenta con ese correo, te mandamos un enlace para elegir
          una contraseña nueva. Puede tardar unos minutos en llegar.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField name="email" label="Correo" error={fieldErrors.email}>
        <Input
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          required
          disabled={isPending}
          leadingIcon={<Mail className="size-4" />}
        />
      </FormField>

      {formError ? (
        <p
          key={errorNonce}
          className="animate-fade-in flex items-start gap-2 border-l-2 border-destructive py-1 pl-3 text-sm text-destructive"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {formError}
        </p>
      ) : null}

      <Button type="submit" className="w-full" size="lg" loading={isPending}>
        {isPending ? "Enviando…" : "Enviar enlace de recuperación"}
      </Button>
    </form>
  );
}
