"use client";

import * as React from "react";

import type { ExecutionResult } from "@/lib/executor";

export type RunState = "idle" | "running" | "done" | "error";

/**
 * Recurso al que pertenece una ejecución. EXACTAMENTE uno de los tres
 * primeros campos.
 *
 * De este recurso el servidor deriva el curso y, con él, el compilador. El
 * cliente NO manda lenguaje ni perfil de ejecución: no tiene forma de
 * pedir un compilador distinto al del curso, ni siquiera manipulando el
 * payload.
 */
export interface RunTarget {
  /** Ejemplo de código ejecutable dentro de una lección. */
  stepId?: string;
  /** Reto de lección (ejecución sin calificar). */
  exerciseId?: string;
  /** Ejercicio de práctica (ejecución sin calificar). */
  practiceExerciseId?: string;
  /** Verificación cruzada opcional; el servidor la valida. */
  lessonId?: string;
}

export interface RunOptions {
  target: RunTarget;
  /** Para atribuir el evento `code_run` a la sesión de estudio. */
  studySessionId?: string | null;
}

export function useRunCode(options: RunOptions) {
  const [state, setState] = React.useState<RunState>("idle");
  const [result, setResult] = React.useState<ExecutionResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Ref para que `run` no cambie de identidad cuando el contexto se
  // rehidrata (p. ej. cuando llega el id de la sesión de estudio).
  const optionsRef = React.useRef<RunOptions>(options);
  React.useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const run = React.useCallback(async (sourceCode: string, stdin = "") => {
    setState("running");
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode,
          stdin,
          target: optionsRef.current.target,
          studySessionId: optionsRef.current.studySessionId ?? null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setState("error");
        setError(data.detail ?? data.error ?? "Falló la ejecución.");
        return;
      }

      setResult(data as ExecutionResult);
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Error de red.");
    }
  }, []);

  const reset = React.useCallback(() => {
    setState("idle");
    setResult(null);
    setError(null);
  }, []);

  return { state, result, error, run, reset };
}
