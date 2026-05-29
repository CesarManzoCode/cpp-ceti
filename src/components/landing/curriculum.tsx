import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { getLandingUnits } from "@/components/landing/queries";

/**
 * Tópicos editoriales por unidad — derivados del contenido real
 * (prisma/content/unidad-*.ts). Cuando aparezca una unidad nueva en la DB
 * cuyo slug no esté aquí, la card simplemente no muestra chips: cero drift,
 * cero mentiras.
 */
const UNIT_TOPICS: Record<string, string[]> = {
  "primer-programa": ["cout", "endl", "comentarios", "salto de línea"],
  "leer-datos": ["cin", "getline", "varios valores", "validar entrada"],
  "variables-y-tipos": ["int / double", "string", "bool", "const"],
  "control-de-flujo": ["if / else", "else if", "switch", "&&  ||"],
  loops: ["while", "for", "do-while", "break / continue"],
  funciones: ["void", "return", "parámetros", "prototipos"],
  "printf-scanf": ["printf", "scanf", "%i  %f"],
  arreglos: ["arrays", "recorrer con for", "sumar y promediar", "buscar mayor"],
  archivos: ["ofstream", "ifstream", "getline", "append"],
  matrices: ["doble for", "filas y columnas", "buscar"],
};

export async function Curriculum() {
  const units = await getLandingUnits();
  const publishedCount = units.filter((u) => u.published).length;

  return (
    <section
      id="temario"
      className="border-b border-border/60 py-16 lg:py-24"
    >
      <Reveal className="mx-auto max-w-5xl px-5 sm:px-6">
        <SectionHeading
          align="left"
          eyebrow="temario"
          title={`${publishedCount} unidades, del primer cout a matrices.`}
          description="Construidas sobre el plan oficial del CETI. Cada unidad combina teoría justa, ejemplos ejecutables, quizzes y retos donde tú escribes el código."
          className="max-w-2xl"
        />

        <ol className="mt-14 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
          {units.map((u) => {
            const topics = UNIT_TOPICS[u.slug] ?? [];
            const rowClass =
              "group flex items-start gap-5 border-t border-border/70 p-5 first:border-t-0 sm:p-6";
            const inner = (
              <>
                <div
                  className={
                    "grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] font-mono text-[13px] font-bold tabular-nums " +
                    (u.published
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-2 text-muted-foreground/50")
                  }
                >
                  {u.published ? (
                    String(u.order).padStart(2, "0")
                  ) : (
                    <Lock className="size-4" aria-hidden />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <p className="eyebrow text-muted-foreground">
                        Unidad {u.order}
                      </p>
                      <h3
                        className={
                          "mt-1 text-[17px] font-semibold tracking-tight sm:text-lg " +
                          (u.published
                            ? "text-foreground"
                            : "text-muted-foreground")
                        }
                      >
                        {u.title}
                      </h3>
                    </div>
                    {u.published ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-60">
                        Empezar
                        <ArrowRight className="size-3" aria-hidden />
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-muted-foreground/70">
                        Próximamente
                      </span>
                    )}
                  </div>
                  {topics.length > 0 ? (
                    <ul className="flex flex-wrap gap-1.5">
                      {topics.map((t) => (
                        <li
                          key={t}
                          className={
                            "inline-flex items-center rounded-full border border-border/70 bg-surface-2/60 px-2.5 py-0.5 text-xs " +
                            (u.published
                              ? "text-muted-foreground"
                              : "text-muted-foreground/60")
                          }
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </>
            );

            return (
              <li key={u.slug}>
                {u.published ? (
                  <Link
                    href="/registro"
                    className={
                      rowClass +
                      " transition-colors hover:bg-surface-2/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                    }
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className={rowClass}>{inner}</div>
                )}
              </li>
            );
          })}
        </ol>
      </Reveal>
    </section>
  );
}
