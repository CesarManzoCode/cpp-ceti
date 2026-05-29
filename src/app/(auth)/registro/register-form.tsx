"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [errorNonce, setErrorNonce] = React.useState(0);

  const busy = isPending || isGoogleLoading;

  React.useEffect(() => {
    if (window.matchMedia("(min-width: 640px)").matches) {
      document.getElementById("name")?.focus();
    }
  }, []);

  function fail(message: string) {
    setError(message);
    setErrorNonce((n) => n + 1);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (name.length < 2) {
      fail("Tu nombre debe tener al menos 2 caracteres.");
      return;
    }
    if (password.length < 8) {
      fail("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    startTransition(async () => {
      const { error: signUpError } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (signUpError) {
        fail(
          signUpError.message ??
            "No pudimos crear tu cuenta. Tal vez ya existe ese correo.",
        );
        return;
      }

      toast.success("¡Cuenta creada! Bienvenido a C++ CETI.");
      router.push("/app");
      router.refresh();
    });
  }

  async function handleGoogle() {
    setError(null);
    setIsGoogleLoading(true);
    const { error: oauthError } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/app",
    });
    if (oauthError) {
      fail(oauthError.message ?? "No pudimos registrarte con Google.");
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

      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Tu nombre"
          required
          minLength={2}
          disabled={busy}
          leadingIcon={<User className="size-4" />}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          required
          disabled={busy}
          leadingIcon={<Mail className="size-4" />}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          required
          minLength={8}
          disabled={busy}
          leadingIcon={<Lock className="size-4" />}
        />
        <p className="text-xs text-muted-foreground">
          Usa al menos 8 caracteres. Hazla difícil de adivinar.
        </p>
      </div>

      {error ? (
        <p
          key={errorNonce}
          className="animate-fade-in flex items-start gap-2 rounded-[var(--radius-md)] border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        loading={isPending}
        disabled={isGoogleLoading}
      >
        {isPending ? "Creando cuenta…" : "Crear cuenta"}
      </Button>
    </form>
  );
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
