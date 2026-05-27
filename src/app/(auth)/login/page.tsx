import { Suspense } from "react";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";

import { LoginForm } from "./login-form";

export const metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <div data-page-enter className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.025em] sm:text-[32px]">
          Bienvenido de nuevo
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
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
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-4 w-32 mx-auto" />
      <Skeleton className="h-[68px] w-full" />
      <Skeleton className="h-[68px] w-full" />
      <Skeleton className="h-11 w-full" />
    </div>
  );
}
