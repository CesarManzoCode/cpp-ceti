import { Suspense } from "react";
import Link from "next/link";

import { LoginForm } from "./login-form";

export const metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Bienvenido de nuevo</h1>
        <p className="text-sm text-muted-foreground">
          Continúa aprendiendo C++ donde lo dejaste.
        </p>
      </div>

      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link
          href="/registro"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          Regístrate gratis
        </Link>
      </p>
    </div>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-20 animate-pulse rounded-lg bg-muted" />
      <div className="h-20 animate-pulse rounded-lg bg-muted" />
      <div className="h-12 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
