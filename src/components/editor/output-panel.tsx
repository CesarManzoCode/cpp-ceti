"use client";

import { AlertTriangle, CheckCircle2, Loader2, Terminal } from "lucide-react";

import type { ExecutionResult } from "@/lib/executor";
import { cn } from "@/lib/utils";

interface OutputPanelProps {
  state: "idle" | "running" | "done" | "error";
  result?: ExecutionResult | null;
  error?: string | null;
  className?: string;
}

export function OutputPanel({
  state,
  result,
  error,
  className,
}: OutputPanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-zinc-950 font-mono text-sm text-zinc-100",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Terminal className="size-3.5" />
          <span>Consola</span>
        </div>
        <StatusBadge state={state} result={result} />
      </div>

      <div className="max-h-72 min-h-24 overflow-auto p-4">
        {state === "idle" ? (
          <p className="text-xs italic text-zinc-500">
            Pulsa <kbd className="rounded bg-zinc-800 px-1.5 py-0.5">Ctrl+Enter</kbd>{" "}
            o el botón Ejecutar para ver tu salida aquí.
          </p>
        ) : null}

        {state === "running" ? (
          <p className="flex items-center gap-2 text-xs text-zinc-400">
            <Loader2 className="size-3.5 animate-spin" />
            Compilando y ejecutando…
          </p>
        ) : null}

        {state === "error" ? (
          <p className="flex items-start gap-2 text-xs text-red-400">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            <span className="whitespace-pre-wrap">{error}</span>
          </p>
        ) : null}

        {state === "done" && result ? <ResultDisplay result={result} /> : null}
      </div>
    </div>
  );
}

function StatusBadge({
  state,
  result,
}: {
  state: OutputPanelProps["state"];
  result?: ExecutionResult | null;
}) {
  if (state === "idle") return null;
  if (state === "running") {
    return <span className="text-xs text-zinc-400">Ejecutando…</span>;
  }
  if (state === "error") {
    return <span className="text-xs text-red-400">Error</span>;
  }
  if (state === "done" && result) {
    const isOk = result.status === "accepted";
    return (
      <span
        className={cn(
          "flex items-center gap-1.5 text-xs",
          isOk ? "text-emerald-400" : "text-amber-400",
        )}
      >
        {isOk ? <CheckCircle2 className="size-3.5" /> : <AlertTriangle className="size-3.5" />}
        {result.message} · {result.durationMs}ms
      </span>
    );
  }
  return null;
}

function ResultDisplay({ result }: { result: ExecutionResult }) {
  if (result.status === "compile_error") {
    return (
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          Error de compilación
        </p>
        <pre className="whitespace-pre-wrap text-xs text-amber-100">
          {result.compileOutput || result.stderr || "Compilación falló sin detalle."}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {result.stdout ? (
        <pre className="whitespace-pre-wrap text-zinc-100">{result.stdout}</pre>
      ) : (
        <p className="text-xs italic text-zinc-500">
          (programa ejecutado sin salida estándar)
        </p>
      )}
      {result.stderr ? (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-red-400">
            stderr
          </p>
          <pre className="whitespace-pre-wrap text-xs text-red-300">
            {result.stderr}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
