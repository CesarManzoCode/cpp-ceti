import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const units = [
  {
    n: 1,
    title: "Tu primer programa en C++",
    topics: ["Hola Mundo", "Estructura", "Compilar", "Comentarios"],
    available: true,
  },
  {
    n: 2,
    title: "Variables y tipos de datos",
    topics: ["int, float, double", "char y string", "bool", "Operadores"],
    available: true,
  },
  {
    n: 3,
    title: "Entrada y salida",
    topics: ["cin / cout", "getline", "Formateo"],
    available: false,
  },
  {
    n: 4,
    title: "Estructuras de control",
    topics: ["if / else", "switch", "while", "for"],
    available: false,
  },
  {
    n: 5,
    title: "Funciones",
    topics: ["Definición", "Parámetros", "Retorno", "Recursión"],
    available: false,
  },
  {
    n: 6,
    title: "Arreglos y vectores",
    topics: ["Arrays", "vector<T>", "Iteración", "std::string"],
    available: false,
  },
  {
    n: 7,
    title: "Punteros y referencias",
    topics: ["* y &", "Paso por referencia", "Aritmética"],
    available: false,
  },
  {
    n: 8,
    title: "POO en C++",
    topics: ["Clases", "Objetos", "Herencia", "Polimorfismo"],
    available: false,
  },
];

export function Curriculum() {
  return (
    <section
      id="temario"
      className="border-b border-border/60 py-16 lg:py-24"
    >
      <Reveal className="mx-auto max-w-5xl px-5 sm:px-6">
        <SectionHeading
          align="left"
          eyebrow="temario"
          title="Ocho unidades, del primer cout hasta POO."
          description="Construidas sobre el plan oficial del CETI. Nuevas lecciones llegan cada semana."
          className="max-w-2xl"
        />

        <ol className="mt-14 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
          {units.map((u) => {
            const rowClass =
              "group flex items-start gap-5 border-t border-border/70 p-5 first:border-t-0 sm:p-6";
            const inner = (
              <>
                <div
                  className={
                    "grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] font-mono text-[13px] font-bold tabular-nums " +
                    (u.available
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-2 text-muted-foreground/50")
                  }
                >
                  {u.available ? (
                    String(u.n).padStart(2, "0")
                  ) : (
                    <Lock className="size-4" aria-hidden />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <p className="eyebrow text-muted-foreground">
                        Unidad {u.n}
                      </p>
                      <h3
                        className={
                          "mt-1 text-[17px] font-semibold tracking-tight sm:text-lg " +
                          (u.available
                            ? "text-foreground"
                            : "text-muted-foreground")
                        }
                      >
                        {u.title}
                      </h3>
                    </div>
                    {u.available ? (
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
                  <ul className="flex flex-wrap gap-1.5">
                    {u.topics.map((t) => (
                      <li
                        key={t}
                        className={
                          "inline-flex items-center rounded-full border border-border/70 bg-surface-2/60 px-2.5 py-0.5 text-xs " +
                          (u.available
                            ? "text-muted-foreground"
                            : "text-muted-foreground/60")
                        }
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            );

            return (
              <li key={u.n}>
                {u.available ? (
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
