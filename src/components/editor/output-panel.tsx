"use client";

import { AlertTriangle, CheckCircle2, Terminal } from "lucide-react";

import { Kbd } from "@/components/ui/kbd";
import { TerminalSurface } from "@/components/ui/terminal-surface";
import { TypingDots } from "@/components/ui/brand-spinner";
import type { ExecutionResult } from "@/lib/executor";
import { cn } from "@/lib/utils";

interface OutputPanelProps {
  state: "idle" | "running" | "done" | "error";
  result?: ExecutionResult | null;
  error?: string | null;
  className?: string;
}

const darkKbd =
  "border-[var(--terminal-border)] bg-terminal-elevated text-terminal-fg";

export function OutputPanel({
  state,
  result,
  error,
  className,
}: OutputPanelProps) {
  return (
    <TerminalSurface
      title="Consola"
      icon={Terminal}
      running={state === "running"}
      trailing={<StatusBadge state={state} result={result} />}
      className={cn("text-sm", className)}
      bodyClassName="max-h-72 min-h-24 overflow-auto p-4"
    >
      <div aria-live="polite" role="status">
        {state === "idle" ? (
          <p className="flex items-center gap-1.5 text-xs italic text-terminal-faint">
            Pulsa <Kbd className={darkKbd}>Ctrl</Kbd>
            <span>+</span>
            <Kbd className={darkKbd}>Enter</Kbd>
            <span>para ejecutar.</span>
          </p>
        ) : null}

        {state === "running" ? (
          <p className="flex items-center gap-2 text-xs text-terminal-muted">
            <TypingDots className="text-terminal-success" />
            Compilando y ejecutando…
          </p>
        ) : null}

        {state === "error" ? (
          <p className="flex items-start gap-2 text-xs text-terminal-danger">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            <span className="whitespace-pre-wrap">{error}</span>
          </p>
        ) : null}

        {state === "done" && result ? <ResultDisplay result={result} /> : null}
      </div>
    </TerminalSurface>
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
    return <span className="text-terminal-muted">Ejecutando…</span>;
  }
  if (state === "error") {
    return <span className="text-terminal-danger">Error</span>;
  }
  if (state === "done" && result) {
    const isOk = result.status === "accepted";
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5",
          isOk ? "text-terminal-success" : "text-terminal-warning",
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
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-terminal-warning">
          Error de compilación
        </p>
        <pre className="whitespace-pre-wrap text-xs text-terminal-warning">
          {result.compileOutput ||
            result.stderr ||
            "Compilación falló sin detalle."}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {result.stdout ? (
        <pre className="whitespace-pre-wrap text-terminal-fg">
          {result.stdout}
        </pre>
      ) : (
        <p className="text-xs italic text-terminal-faint">
          (programa ejecutado sin salida estándar)
        </p>
      )}
      {result.stderr ? (
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-terminal-danger">
            stderr
          </p>
          <pre className="whitespace-pre-wrap text-xs text-terminal-danger">
            {result.stderr}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
