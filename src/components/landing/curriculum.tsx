import Link from "next/link";
import { Lock } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { getLandingUnits } from "@/components/landing/queries";

/**
 * Tópicos por unidad — derivados del contenido real
 * (prisma/content/unidad-*.ts). Cuando aparezca una unidad nueva en la DB
 * cuyo slug no esté aquí, la fila simplemente no muestra chips: cero drift,
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

/**
 * El índice del cuaderno, con la misma canaleta numerada que verás dentro
 * de la app. La pregunta real de un alumno del CETI es "¿están mis temas?",
 * así que el temario es la sección con más peso de la portada.
 */
export async function Curriculum() {
  const units = await getLandingUnits();
  const publishedCount = units.filter((u) => u.published).length;

  return (
    <section id="temario" className="border-b border-border py-16 lg:py-28">
      <Reveal className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          eyebrow="Temario"
          title={`${publishedCount} unidades, del primer cout a matrices.`}
          description="Construidas sobre el plan oficial del CETI. Cada unidad combina teoría justa, ejemplos ejecutables, quizzes y retos donde tú escribes el código."
        />

        <ol className="gutter-list mt-12 max-w-4xl border-y border-border">
          {units.map((u) => {
            const topics = UNIT_TOPICS[u.slug] ?? [];

            const body = (
              <>
                <span className="flex items-start justify-center pr-3 pt-5">
                  {u.published ? (
                    <span
                      aria-hidden
                      className="font-mono text-[13px] tabular-nums text-foreground"
                    >
                      {String(u.order).padStart(2, "0")}
                    </span>
                  ) : (
                    <Lock
                      className="size-3.5 text-muted-foreground/50"
                      aria-hidden
                    />
                  )}
                </span>

                <span className="min-w-0 py-5 pl-4">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span
                      className={
                        "text-[16px] font-semibold leading-snug sm:text-[17px] " +
                        (u.published ? "text-foreground" : "text-muted-foreground")
                      }
                    >
                      {u.title}
                    </span>
                    {!u.published ? (
                      <span className="label-micro text-muted-foreground/70">
                        Próximamente
                      </span>
                    ) : null}
                  </span>

                  {topics.length > 0 ? (
                    <span className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[11.5px] text-muted-foreground">
                      {topics.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </span>
                  ) : null}
                </span>
              </>
            );

            return (
              <li key={u.slug} className="border-t border-border first:border-t-0">
                {u.published ? (
                  <Link
                    href="/registro"
                    className="gutter-row transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="gutter-row opacity-70">{body}</div>
                )}
              </li>
            );
          })}
        </ol>
      </Reveal>
    </section>
  );
}
