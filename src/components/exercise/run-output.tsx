import { TerminalSurface } from "@/components/ui/terminal-surface";
import type { ExecutionResult } from "@/lib/executor";
import type { RunState } from "@/hooks/use-run-code";

interface RunOutputProps {
  state: RunState;
  result: ExecutionResult | null;
  error: string | null;
}

/** Inline "Salida" panel for the Probar (run-without-grading) action. */
export function RunOutput({ state, result, error }: RunOutputProps) {
  if (state === "idle") return null;

  return (
    <TerminalSurface
      title="Salida"
      running={state === "running"}
      headerClassName="py-2"
      bodyClassName="max-h-72 space-y-2 overflow-auto p-4 text-[13.5px] leading-relaxed"
    >
      {state === "running" ? (
        <p className="font-sans text-[13px] text-terminal-muted">Ejecutando…</p>
      ) : null}
      {error ? <p className="text-terminal-danger">{error}</p> : null}
      {result ? (
        <>
          {result.stdout ? (
            <pre className="whitespace-pre-wrap">{result.stdout}</pre>
          ) : null}
          {result.compileOutput ? (
            <pre className="whitespace-pre-wrap text-terminal-warning">
              {result.compileOutput}
            </pre>
          ) : null}
          {result.stderr ? (
            <pre className="whitespace-pre-wrap text-terminal-danger">
              {result.stderr}
            </pre>
          ) : null}
          {!result.stdout && !result.compileOutput && !result.stderr ? (
            <p className="font-sans text-[13px] text-terminal-faint">
              (programa ejecutado sin salida)
            </p>
          ) : null}
          <p className="font-sans text-[12px] font-semibold text-terminal-faint">
            {result.message} · {result.durationMs}ms
          </p>
        </>
      ) : null}
    </TerminalSurface>
  );
}
