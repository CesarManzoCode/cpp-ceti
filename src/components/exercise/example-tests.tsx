import { IOBlock } from "@/components/exercise/io-block";

interface VisibleTest {
  id: string;
  stdin: string;
  expectedStdout: string;
  description: string | null;
}

/** The "Ejemplos" panel of visible input/output samples for an exercise. */
export function ExampleTests({ tests }: { tests: VisibleTest[] }) {
  if (tests.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Ejemplos
      </h4>
      <div className="space-y-2">
        {tests.map((t, idx) => (
          <div
            key={t.id}
            className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-card text-sm"
          >
            <div className="border-b border-border/70 bg-surface-2/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Ejemplo {idx + 1}
              {t.description ? (
                <span className="ml-2 font-normal normal-case tracking-normal text-muted-foreground/80">
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
