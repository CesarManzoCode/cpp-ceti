import { IOBlock } from "@/components/exercise/io-block";
import type { VisibleTest } from "@/components/exercise/types";

/** The "Ejemplos" panel of visible input/output samples for an exercise. */
export function ExampleTests({ tests }: { tests: VisibleTest[] }) {
  if (tests.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="text-[15px] font-bold text-foreground">Ejemplos</h4>
        <span className="text-[13px] font-semibold tabular-nums text-muted-foreground">
          {tests.length} {tests.length === 1 ? "caso" : "casos"}
        </span>
      </div>
      <div className="space-y-2">
        {tests.map((t, idx) => (
          <div
            key={t.id}
            className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-xs)]"
          >
            <div className="flex flex-wrap items-baseline gap-2 border-b border-border bg-surface-2 px-4 py-2.5 text-[13px] font-bold text-muted-foreground">
              Ejemplo {idx + 1}
              {t.description ? (
                <span className="font-medium text-subtle-foreground">
                  {t.description}
                </span>
              ) : null}
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2">
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
