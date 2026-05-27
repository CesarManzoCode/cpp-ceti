"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Error boundary para todas las rutas dentro de /app.
 * Sin esto, un crash en el server component deja al usuario
 * atascado en loading.tsx para siempre.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Útil para Vercel logs
    console.error("[app:error-boundary]", error);
  }, [error]);

  return (
    <div className="grid min-h-[60vh] place-items-center px-5 py-12">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-destructive-soft text-destructive">
          <AlertTriangle className="size-7" aria-hidden />
        </div>

        <div className="space-y-2">
          <h1 className="text-balance text-2xl font-bold tracking-tight">
            Algo salió mal cargando esta página.
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Si el problema persiste, intenta recargar. Si sigue fallando,
            avísanos.
          </p>
          {error?.digest ? (
            <p className="font-mono text-[10px] text-muted-foreground/70">
              ref: {error.digest}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Button onClick={reset} size="lg">
            <RotateCcw />
            Reintentar
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/app">
              <ArrowLeft />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
