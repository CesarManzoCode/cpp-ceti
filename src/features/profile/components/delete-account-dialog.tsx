"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Lock } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";

interface DeleteAccountDialogProps {
  userEmail: string;
}

type Errors = Partial<Record<"confirmation" | "password", string>>;

export function DeleteAccountDialog({ userEmail }: DeleteAccountDialogProps) {
  const router = useRouter();
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
    const confirmation = String(fd.get("confirmation") ?? "").trim();
    const password = String(fd.get("password") ?? "");

    const fieldErrors: Errors = {};
    if (confirmation !== userEmail) {
      fieldErrors.confirmation = "Escribe tu correo exactamente como aparece arriba";
    }
    if (!password) {
      fieldErrors.password = "Ingresa tu contraseña para confirmar";
    }
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const { error } = await authClient.deleteUser({ password });
    setSubmitting(false);

    if (error) {
      setFormError(error.message ?? "No pudimos eliminar tu cuenta.");
      return;
    }

    toast.success("Cuenta eliminada. Hasta pronto.");
    router.push("/");
    router.refresh();
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
        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
          Eliminar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" aria-hidden />
              Eliminar tu cuenta
            </DialogTitle>
            <DialogDescription>
              Esto borra tu progreso, intentos, racha y XP de manera{" "}
              <strong>permanente</strong>. No se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-[var(--radius-md)] border border-destructive/30 bg-destructive-soft p-3 text-sm">
            <p className="font-medium text-destructive">{userEmail}</p>
            <p className="text-foreground/80">
              Escribe tu correo exactamente para confirmar que sabes lo que
              haces.
            </p>
          </div>

          <FormField
            name="confirmation"
            label="Confirma tu correo"
            error={errors.confirmation}
          >
            <Input
              type="email"
              autoComplete="off"
              placeholder={userEmail}
              required
            />
          </FormField>

          <FormField
            name="password"
            label="Tu contraseña"
            error={errors.password}
          >
            <PasswordInput
              autoComplete="current-password"
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
            <Button
              type="submit"
              variant="destructive"
              loading={submitting}
            >
              Eliminar para siempre
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
