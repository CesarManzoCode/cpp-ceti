"use client";

import * as React from "react";

import type { ExecutionResult } from "@/lib/executor";

export type RunState = "idle" | "running" | "done" | "error";

/**
 * Contexto de producto de una ejecución del playground (botón "Compilar").
 * Se manda al servidor para que EL SERVIDOR registre el evento `code_run`:
 * el cliente no decide si el código compiló ni cuándo ocurrió.
 */
export interface RunContext {
  surface: "lesson" | "practice" | "playground";
  lessonId?: string | null;
  exerciseId?: string | null;
  practiceExerciseId?: string | null;
  studySessionId?: string | null;
}

export function useRunCode(context?: RunContext) {
  const [state, setState] = React.useState<RunState>("idle");
  const [result, setResult] = React.useState<ExecutionResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Ref para que `run` no cambie de identidad cuando el contexto se
  // rehidrata (p. ej. cuando llega el id de la sesión de estudio).
  const contextRef = React.useRef<RunContext | undefined>(context);
  React.useEffect(() => {
    contextRef.current = context;
  }, [context]);

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
          ...(contextRef.current ? { context: contextRef.current } : {}),
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
