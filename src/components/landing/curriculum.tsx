import Link from "next/link";
import { Lock } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { getLandingCourses } from "@/components/landing/queries";
import { LANGUAGE_PROFILES, isLanguageId } from "@/lib/code-languages";

/**
 * Tópicos por unidad — derivados del contenido real
 * (`prisma/content/**`). Cuando aparezca una unidad nueva en la DB cuyo
 * slug no esté aquí, la fila simplemente no muestra chips: cero drift,
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

  "csharp-poo-01-modelar": ["clase / objeto", "campos", "métodos", "abstracción"],
  "csharp-poo-02-encapsular": ["private / public", "propiedades", "constructores", "sobrecarga"],
  "csharp-poo-03-uml": ["diagrama de clases", "+ - #", "UML → C#", "C# → UML"],
  "csharp-poo-04-relaciones": ["dependencia", "asociación", "agregación", "composición"],
  "csharp-poo-05-herencia": ["is-a", "base", "virtual / override", "clases abstractas"],
  "csharp-poo-06-diseno-robusto": ["static", "validación", "excepciones", "capa de dominio"],
  "csharp-poo-07-gui": ["Windows Forms", "controles", "eventos", "publicación"],
  "csharp-poo-08-integrador": ["requisitos", "UML", "aceptación", "reporte"],
};

/**
 * El índice del cuaderno, con la misma canaleta numerada que verás dentro
 * de la app. La pregunta real de un alumno del CETI es "¿están mis temas?",
 * así que el temario es la sección con más peso de la portada.
 */
export async function Curriculum() {
  const courses = await getLandingCourses();
  const publishedCount = courses.reduce(
    (n, c) => n + c.units.filter((u) => u.published).length,
    0,
  );

  return (
    <section id="temario" className="border-b border-border py-16 lg:py-28">
      <Reveal className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          eyebrow="Temario"
          title={`${publishedCount} unidades en ${courses.length} ${
            courses.length === 1 ? "curso" : "cursos"
          }.`}
          description="Construidas sobre los planes oficiales del CETI. Cada unidad combina teoría justa, ejemplos ejecutables, quizzes y retos donde tú escribes el código."
        />

        {courses.map((course) => (
        <div key={course.slug} className="mt-12 max-w-4xl">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-[20px] font-extrabold tracking-[-0.02em]">
              {course.title}
            </h3>
            <span className="rounded-full bg-primary-tint px-2.5 py-0.5 text-[12px] font-bold text-primary">
              {isLanguageId(course.language)
                ? LANGUAGE_PROFILES[course.language].label
                : course.language}
            </span>
            <span className="text-[13px] font-semibold text-subtle-foreground">
              {course.subjectName}
            </span>
          </div>

        <ol className="mt-5 flex flex-col gap-3">
          {course.units.map((u) => {
            const topics = UNIT_TOPICS[u.slug] ?? [];

            const body = (
              <>
                <span className="flex shrink-0 items-start pt-0.5">
                  {u.published ? (
                    <span
                      aria-hidden
                      className="grid size-9 place-items-center rounded-[var(--radius-md)] bg-primary text-[15px] font-extrabold tabular-nums text-primary-foreground"
                    >
                      {u.order}
                    </span>
                  ) : (
                    <span
                      aria-hidden
                      className="grid size-9 place-items-center rounded-[var(--radius-md)] border border-dashed border-border-strong text-subtle-foreground"
                    >
                      <Lock className="size-4" />
                    </span>
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span
                      className={
                        "text-[17px] font-bold leading-snug sm:text-[18px] " +
                        (u.published ? "text-foreground" : "text-muted-foreground")
                      }
                    >
                      {u.title}
                    </span>
                    {!u.published ? (
                      <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                        Próximamente
                      </span>
                    ) : null}
                  </span>

                  {topics.length > 0 ? (
                    <span className="mt-3 flex flex-wrap gap-2">
                      {topics.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-surface-2 px-2.5 py-1 text-[12px] font-semibold text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </span>
              </>
            );

            return (
              <li key={u.slug}>
                {u.published ? (
                  <Link
                    href="/registro"
                    className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-xs)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-md)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:p-5"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="flex items-start gap-4 rounded-[var(--radius-lg)] border border-dashed border-border-strong p-4 sm:p-5">
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        </div>
        ))}
      </Reveal>
    </section>
  );
}
