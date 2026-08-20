"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/shared/status-message";

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
      <StatusMessage
        tone="error"
        code="error"
        title="Algo salió mal cargando esta página."
        description="Si el problema persiste, intenta recargar. Si sigue fallando, avísanos."
        reference={error?.digest}
      >
        <Button onClick={reset} size="lg">
          <RotateCcw />
          Reintentar
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/app">
            <ArrowLeft />
            Volver al inicio
          </Link>
        </Button>
      </StatusMessage>
    </div>
  );
}
