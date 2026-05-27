import type { CSSProperties } from "react";
import { Check, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";

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
      className="border-b border-border/60 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          align="center"
          eyebrow="temario"
          title="8 unidades, del primer cout hasta POO."
          description={
            <>
              Construidas sobre el plan oficial del CETI. Nuevas lecciones
              llegan cada semana.
            </>
          }
          className="mx-auto items-center"
        />

        {/* Path */}
        <div className="relative mt-14">
          {/* Vertical line backbone (desktop) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[27px] top-0 hidden h-full w-px bg-gradient-to-b from-border via-border to-transparent sm:block"
          />

          <ol
            data-stagger
            style={{ "--stagger": "60ms" } as CSSProperties}
            className="space-y-3"
          >
            {units.map((u, idx) => {
              const isAvailable = u.available;
              return (
                <li
                  key={u.n}
                  style={{ "--i": idx } as CSSProperties}
                  className="animate-fade-up relative flex items-stretch gap-4 sm:gap-6"
                >
                  {/* Node */}
                  <div
                    className={`relative z-10 grid size-[54px] shrink-0 place-items-center rounded-2xl font-mono text-lg font-bold ring-1 ring-inset ${
                      isAvailable
                        ? "bg-primary text-primary-foreground ring-primary/40 shadow-[0_6px_16px_-4px_var(--primary)]"
                        : "bg-surface-2 text-muted-foreground/70 ring-border"
                    }`}
                  >
                    {isAvailable ? (
                      <span>{u.n.toString().padStart(2, "0")}</span>
                    ) : (
                      <Lock className="size-4" aria-hidden />
                    )}
                  </div>

                  {/* Card */}
                  <article
                    className={`group flex-1 rounded-[var(--radius-xl)] border bg-card p-5 transition-[transform,box-shadow,border-color] ${
                      isAvailable
                        ? "border-border shadow-[var(--shadow-xs)] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-md)]"
                        : "border-dashed border-border opacity-70"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          Unidad {u.n}
                        </p>
                        <h3 className="mt-0.5 text-lg font-semibold tracking-tight">
                          {u.title}
                        </h3>
                      </div>
                      {isAvailable ? (
                        <Badge variant="success" size="sm">
                          <Check className="size-3" strokeWidth={3} />
                          Disponible
                        </Badge>
                      ) : (
                        <Badge variant="secondary" size="sm">
                          Próximo
                        </Badge>
                      )}
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {u.topics.map((t) => (
                        <li
                          key={t}
                          className="inline-flex items-center rounded-full border border-border/70 bg-surface-2/60 px-2.5 py-0.5 text-xs text-muted-foreground"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
