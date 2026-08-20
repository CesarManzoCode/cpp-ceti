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
      <div>
        <p className="label-micro text-muted-foreground">Iniciar sesión</p>
        <h1 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.025em] sm:text-[30px]">
          Bienvenido de nuevo
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Continúa aprendiendo C++ donde lo dejaste.
        </p>
      </div>

      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>

      <p className="border-t border-border pt-5 text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link
          href="/registro"
          className="text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-current"
        >
          Crea una gratis
        </Link>
      </p>
    </div>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-11 w-full" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-px flex-1" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-px flex-1" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-11 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-11 w-full" />
      </div>
      <Skeleton className="h-11 w-full" />
    </div>
  );
}
