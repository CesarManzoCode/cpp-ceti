import { IOBlock } from "@/components/exercise/io-block";
import type { VisibleTest } from "@/components/exercise/types";

/** The "Ejemplos" panel of visible input/output samples for an exercise. */
export function ExampleTests({ tests }: { tests: VisibleTest[] }) {
  if (tests.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h4 className="label-micro text-muted-foreground">Ejemplos</h4>
        <span aria-hidden className="h-px flex-1 bg-border" />
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {tests.length} {tests.length === 1 ? "caso" : "casos"}
        </span>
      </div>
      <div className="space-y-2">
        {tests.map((t, idx) => (
          <div
            key={t.id}
            className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-card text-sm"
          >
            <div className="label-micro flex flex-wrap items-baseline gap-2 border-b border-border bg-surface-2 px-3 py-2 text-muted-foreground">
              Ejemplo {String(idx + 1).padStart(2, "0")}
              {t.description ? (
                <span className="font-sans text-[11px] normal-case tracking-normal text-muted-foreground/80">
                  {t.description}
                </span>
              ) : null}
            </div>
            <div className="grid gap-3 p-3 sm:grid-cols-2">
              <IOBlock
                label="Entrada"
                value={t.stdin || "(ninguna)"}
                muted={!t.stdin}
              />
              <IOBlock label="Salida esperada" value={t.expectedStdout} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
