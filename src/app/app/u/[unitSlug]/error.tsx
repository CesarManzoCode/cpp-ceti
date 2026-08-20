"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/shared/status-message";

export default function UnitError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[unit:error-boundary]", error);
  }, [error]);

  return (
    <div className="grid min-h-[60vh] place-items-center px-5 py-12">
      <StatusMessage
        tone="error"
        code="error"
        title="No pudimos cargar esta unidad."
        description="Suele ser un problema momentáneo. Reintenta o regresa a tu camino."
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
