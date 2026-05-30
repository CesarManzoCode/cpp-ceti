"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, AtSign, Check, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  FormField,
  zodIssuesToFieldErrors,
} from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";
import {
  USERNAME_MAX,
  USERNAME_MIN,
  usernameSchema,
} from "@/lib/validation";
import { checkUsernameAvailability } from "@/features/profile/actions";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tu nombre debe tener al menos 2 caracteres")
    .max(60, "Máximo 60 caracteres"),
  username: usernameSchema,
  email: z
    .string()
    .trim()
    .min(1, "Tu correo es obligatorio")
    .email("Correo inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type FieldErrors = Partial<
  Record<"name" | "username" | "email" | "password", string>
>;

type UsernameStatus =
  | { kind: "idle" }
  | { kind: "bad-format"; reason: string }
  | { kind: "checking" }
  | { kind: "ok"; normalized: string }
  | { kind: "taken"; reason: string };

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [errorNonce, setErrorNonce] = React.useState(0);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [usernameValue, setUsernameValue] = React.useState("");
  // Estado async (resultado del fetch de disponibilidad).
  const [availabilityStatus, setAvailabilityStatus] = React.useState<
    UsernameStatus & { for: string } | null
  >(null);

  const busy = isPending || isGoogleLoading;

  // Status sincrónico derivado del input — sin setState desde effects.
  const syncStatus = React.useMemo<UsernameStatus>(() => {
    const trimmed = usernameValue.trim();
    if (trimmed.length === 0) return { kind: "idle" };
    const parsed = usernameSchema.safeParse(trimmed);
    if (!parsed.success) {
      return {
        kind: "bad-format",
        reason: parsed.error.issues[0]?.message ?? "Formato inválido",
      };
    }
    return { kind: "checking" };
  }, [usernameValue]);

  // Status mostrado: si el sync es válido y tenemos un resultado fresco
  // para el valor actual, lo preferimos; si no, mostramos el sync.
  const usernameStatus: UsernameStatus =
    syncStatus.kind === "checking" &&
    availabilityStatus &&
    availabilityStatus.for === usernameValue.trim()
      ? availabilityStatus
      : syncStatus;

  React.useEffect(() => {
    if (window.matchMedia("(min-width: 640px)").matches) {
      document.getElementById("name")?.focus();
    }
  }, []);

  // Fetch debounced de disponibilidad. Sólo se dispara cuando el sync OK.
  React.useEffect(() => {
    if (syncStatus.kind !== "checking") return;
    const trimmed = usernameValue.trim();
    const handle = setTimeout(async () => {
      try {
        const result = await checkUsernameAvailability({ username: trimmed });
        if (result.available) {
          setAvailabilityStatus({
            kind: "ok",
            normalized: result.normalized,
            for: trimmed,
          });
        } else {
          setAvailabilityStatus({
            kind: "taken",
            reason: result.reason,
            for: trimmed,
          });
        }
      } catch {
        // silent — el submit re-valida server-side
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [syncStatus.kind, usernameValue]);

  function failForm(message: string) {
    setFormError(message);
    setErrorNonce((n) => n + 1);
  }

  function handleNameBlur(event: React.FocusEvent<HTMLInputElement>) {
    // Autosugerir username una sola vez al salir de "Nombre" si está vacío.
    if (usernameValue.trim().length > 0) return;
    const name = event.currentTarget.value.trim();
    if (name.length < 2) return;
    const suggestion = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, USERNAME_MAX);
    if (suggestion.length >= USERNAME_MIN) {
      setUsernameValue(suggestion);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const parsed = registerSchema.safeParse({
      name: String(formData.get("name") ?? "").trim(),
      username: String(formData.get("username") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    });
    if (!parsed.success) {
      setFieldErrors(zodIssuesToFieldErrors(parsed.error.issues));
      return;
    }

    if (usernameStatus.kind === "bad-format" || usernameStatus.kind === "taken") {
      setFieldErrors((e) => ({ ...e, username: usernameStatus.reason }));
      return;
    }

    startTransition(async () => {
      const { error: signUpError } = await authClient.signUp.email({
        name: parsed.data.name,
        username: parsed.data.username,
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (signUpError) {
        failForm(
          signUpError.message ??
            "No pudimos crear tu cuenta. Tal vez ya existe ese correo o usuario.",
        );
        return;
      }

      toast.success("¡Cuenta creada! Bienvenido a C++ CETI.");
      router.push("/app");
      router.refresh();
    });
  }

  async function handleGoogle() {
    setFormError(null);
    setFieldErrors({});
    setIsGoogleLoading(true);
    const { error: oauthError } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/app",
    });
    if (oauthError) {
      failForm(oauthError.message ?? "No pudimos registrarte con Google.");
      setIsGoogleLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        size="lg"
        onClick={handleGoogle}
        loading={isGoogleLoading}
        disabled={busy}
      >
        {isGoogleLoading ? null : <GoogleIcon />}
        Continuar con Google
      </Button>

      <Divider>o con tu correo</Divider>

      <FormField name="name" label="Nombre" error={fieldErrors.name}>
        <Input
          type="text"
          autoComplete="name"
          placeholder="Tu nombre"
          required
          minLength={2}
          disabled={busy}
          leadingIcon={<User className="size-4" />}
          onBlur={handleNameBlur}
        />
      </FormField>

      <FormField
        name="username"
        label="Nombre de usuario"
        error={fieldErrors.username ?? statusError(usernameStatus)}
        hint={
          fieldErrors.username || statusError(usernameStatus)
            ? undefined
            : statusHint(usernameStatus)
        }
      >
        <Input
          type="text"
          autoComplete="username"
          placeholder="cesar123"
          required
          minLength={USERNAME_MIN}
          maxLength={USERNAME_MAX}
          disabled={busy}
          leadingIcon={<AtSign className="size-4" />}
          trailing={statusIcon(usernameStatus)}
          inputMode="text"
          spellCheck={false}
          value={usernameValue}
          onChange={(e) =>
            setUsernameValue(e.currentTarget.value.toLowerCase())
          }
        />
      </FormField>

      <FormField name="email" label="Correo" error={fieldErrors.email}>
        <Input
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          required
          disabled={busy}
          leadingIcon={<Mail className="size-4" />}
        />
      </FormField>

      <FormField
        name="password"
        label="Contraseña"
        error={fieldErrors.password}
        hint="Usa al menos 8 caracteres. Hazla difícil de adivinar."
      >
        <PasswordInput
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          required
          minLength={8}
          disabled={busy}
          leadingIcon={<Lock className="size-4" />}
        />
      </FormField>

      {formError ? (
        <p
          key={errorNonce}
          className="animate-fade-in flex items-start gap-2 rounded-[var(--radius-md)] border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {formError}
        </p>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        loading={isPending}
        disabled={
          isGoogleLoading ||
          usernameStatus.kind === "bad-format" ||
          usernameStatus.kind === "taken"
        }
      >
        {isPending ? "Creando cuenta…" : "Crear cuenta"}
      </Button>
    </form>
  );
}

function statusError(s: UsernameStatus): string | undefined {
  if (s.kind === "bad-format" || s.kind === "taken") return s.reason;
  return undefined;
}

function statusHint(s: UsernameStatus): string | undefined {
  if (s.kind === "checking") return "Verificando disponibilidad…";
  if (s.kind === "ok") return "Disponible";
  return "3-20 letras, números o guion bajo. No se puede cambiar después.";
}

function statusIcon(s: UsernameStatus): React.ReactNode {
  if (s.kind === "ok") {
    return <Check className="size-4 text-success" aria-hidden />;
  }
  if (s.kind === "checking") {
    return (
      <span
        className="block size-3.5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground"
        aria-hidden
      />
    );
  }
  return null;
}

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative my-1 flex items-center">
      <span className="h-px flex-1 bg-border" aria-hidden />
      <span className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {children}
      </span>
      <span className="h-px flex-1 bg-border" aria-hidden />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
        fill="#EA4335"
      />
    </svg>
  );
}
