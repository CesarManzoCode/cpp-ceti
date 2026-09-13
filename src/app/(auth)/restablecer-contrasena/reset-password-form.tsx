"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FormField, focusFirstError, zodIssuesToFieldErrors } from "@/components/ui/form-field";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type FieldErrors = Partial<Record<"newPassword", string>>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Better Auth arma el enlace del correo con este query param — ver
  // `sendResetPassword` en `src/lib/auth.ts`.
  const token = searchParams.get("token");

  const [isPending, startTransition] = React.useTransition();
  const [formError, setFormError] = React.useState<string | null>(null);
  const [errorNonce, setErrorNonce] = React.useState(0);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});

  if (!token) {
    return (
      <p
        className="flex items-start gap-2 border-l-2 border-destructive py-1 pl-3 text-sm text-destructive"
        role="alert"
      >
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
        Este enlace no es válido. Pide uno nuevo desde &ldquo;¿Olvidaste tu
        contraseña?&rdquo;.
      </p>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const parsed = resetPasswordSchema.safeParse({
      newPassword: String(formData.get("newPassword") ?? ""),
    });
    if (!parsed.success) {
      const errors = zodIssuesToFieldErrors(parsed.error.issues);
      setFieldErrors(errors);
      focusFirstError(errors);
      return;
    }

    startTransition(async () => {
      const { error } = await authClient.resetPassword({
        newPassword: parsed.data.newPassword,
        token: token!,
      });

      if (error) {
        setFormError(
          error.message ??
            "Este enlace ya expiró o no es válido. Pide uno nuevo.",
        );
        setErrorNonce((n) => n + 1);
        return;
      }

      toast.success("Contraseña actualizada. Ya puedes iniciar sesión.");
      router.push("/login");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField
        name="newPassword"
        label="Contraseña nueva"
        error={fieldErrors.newPassword}
        hint="Usa al menos 8 caracteres. Hazla difícil de adivinar."
      >
        <PasswordInput
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          required
          minLength={8}
          disabled={isPending}
          leadingIcon={<Lock className="size-4" />}
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
        {isPending ? "Guardando…" : "Guardar contraseña nueva"}
      </Button>
    </form>
  );
}
