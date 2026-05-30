"use client";

import * as React from "react";
import { Lock } from "lucide-react";
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
import { FormField } from "@/components/ui/form-field";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";

type Errors = Partial<
  Record<"currentPassword" | "newPassword" | "confirmPassword", string>
>;

export function ChangePasswordDialog() {
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});
  const [formError, setFormError] = React.useState<string | null>(null);

  function reset() {
    setErrors({});
    setFormError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    reset();

    const fd = new FormData(event.currentTarget);
    const currentPassword = String(fd.get("currentPassword") ?? "");
    const newPassword = String(fd.get("newPassword") ?? "");
    const confirmPassword = String(fd.get("confirmPassword") ?? "");

    const fieldErrors: Errors = {};
    if (!currentPassword) {
      fieldErrors.currentPassword = "Ingresa tu contraseña actual";
    }
    if (newPassword.length < 8) {
      fieldErrors.newPassword = "Mínimo 8 caracteres";
    }
    if (confirmPassword !== newPassword) {
      fieldErrors.confirmPassword = "No coincide con la nueva contraseña";
    }
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setSubmitting(false);

    if (error) {
      setFormError(error.message ?? "No pudimos cambiar tu contraseña.");
      return;
    }

    toast.success("Contraseña actualizada. Cerramos otras sesiones por seguridad.");
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Cambiar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Cambiar contraseña</DialogTitle>
            <DialogDescription>
              Al guardar cerramos las sesiones abiertas en otros dispositivos.
            </DialogDescription>
          </DialogHeader>

          <FormField
            name="currentPassword"
            label="Contraseña actual"
            error={errors.currentPassword}
          >
            <PasswordInput
              autoComplete="current-password"
              required
              leadingIcon={<Lock className="size-4" />}
            />
          </FormField>

          <FormField
            name="newPassword"
            label="Nueva contraseña"
            error={errors.newPassword}
            hint="Mínimo 8 caracteres."
          >
            <PasswordInput
              autoComplete="new-password"
              required
              minLength={8}
              leadingIcon={<Lock className="size-4" />}
            />
          </FormField>

          <FormField
            name="confirmPassword"
            label="Confirma la nueva"
            error={errors.confirmPassword}
          >
            <PasswordInput
              autoComplete="new-password"
              required
              leadingIcon={<Lock className="size-4" />}
            />
          </FormField>

          {formError ? (
            <p
              className="rounded-[var(--radius-md)] border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {formError}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={submitting}>
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
