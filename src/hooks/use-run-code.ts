"use client";

import * as React from "react";

import type { ExecutionResult } from "@/lib/executor";

export type RunState = "idle" | "running" | "done" | "error";

export function useRunCode() {
  const [state, setState] = React.useState<RunState>("idle");
  const [result, setResult] = React.useState<ExecutionResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const run = React.useCallback(async (sourceCode: string, stdin = "") => {
    setState("running");
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceCode, stdin }),
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
