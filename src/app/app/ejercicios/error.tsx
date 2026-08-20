"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/shared/status-message";

export default function ExercisesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[ejercicios:error-boundary]", error);
  }, [error]);

  return (
    <div className="grid min-h-[60vh] place-items-center px-5 py-12">
      <StatusMessage
        tone="error"
        code="error"
        title="No pudimos cargar los ejercicios."
        description="Reintenta — si sigue, vuelve al inicio."
        reference={error?.digest}
      >
        <Button onClick={reset} size="lg">
          <RotateCcw />
          Reintentar
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/app">
            <ArrowLeft />
            Inicio
          </Link>
        </Button>
      </StatusMessage>
    </div>
  );
}
