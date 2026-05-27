"use client";

import { AlertTriangle, CheckCircle2, Terminal } from "lucide-react";

import { Kbd } from "@/components/ui/kbd";
import { TypingDots } from "@/components/ui/brand-spinner";
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
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--terminal-border)] bg-[var(--terminal-bg)] font-mono text-sm text-zinc-100",
        state === "running" && "scan-sweep",
        className,
      )}
    >
      <div className="relative flex items-center justify-between border-b border-[var(--terminal-border)] px-4 py-2">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-400">
          <Terminal className="size-3.5" aria-hidden />
          Consola
        </div>
        <StatusBadge state={state} result={result} />
      </div>

      <div className="relative max-h-72 min-h-24 overflow-auto p-4">
        {state === "idle" ? (
          <p className="flex items-center gap-1.5 text-xs italic text-zinc-500">
            Pulsa <Kbd className="border-zinc-700 bg-zinc-800 text-zinc-200">Ctrl</Kbd>
            <span>+</span>
            <Kbd className="border-zinc-700 bg-zinc-800 text-zinc-200">Enter</Kbd>
            <span>para ejecutar.</span>
          </p>
        ) : null}

        {state === "running" ? (
          <p className="flex items-center gap-2 text-xs text-zinc-400">
            <TypingDots className="text-emerald-400" />
            Compilando y ejecutando…
          </p>
        ) : null}

        {state === "error" ? (
          <p className="flex items-start gap-2 text-xs text-red-400">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
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
          "inline-flex items-center gap-1.5 text-xs",
          isOk ? "text-emerald-400" : "text-amber-400",
        )}
      >
        {isOk ? (
          <CheckCircle2 className="size-3.5" aria-hidden />
        ) : (
          <AlertTriangle className="size-3.5" aria-hidden />
        )}
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
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
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
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-red-400">
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
