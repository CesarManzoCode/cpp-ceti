import type { CSSProperties } from "react";

import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";

const units = [
  {
    n: 1,
    title: "Tu primer programa en C++",
    topics: ["Hola Mundo", "Estructura de un programa", "Compilar y ejecutar", "Comentarios"],
    available: true,
  },
  {
    n: 2,
    title: "Variables y tipos de datos",
    topics: ["int, float, double", "char y string", "bool", "Constantes", "Operadores"],
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
    topics: ["if / else", "switch", "while", "for", "do-while"],
    available: false,
  },
  {
    n: 5,
    title: "Funciones",
    topics: ["Definición", "Parámetros", "Retorno", "Sobrecarga", "Recursión"],
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
    topics: ["* y &", "Paso por valor vs referencia", "Aritmética de punteros"],
    available: false,
  },
  {
    n: 8,
    title: "Programación orientada a objetos",
    topics: ["Clases", "Objetos", "Constructores", "Herencia", "Polimorfismo"],
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
          title="Basado en el plan oficial del CETI"
          description={
            <>
              8 unidades que van del primer{" "}
              <code className="code-inline">cout</code> hasta POO. Nuevas
              lecciones cada semana.
            </>
          }
          className="mx-auto items-center"
        />

        <ul
          data-stagger
          style={{ "--stagger": "55ms" } as CSSProperties}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {units.map((u, idx) => (
            <li
              key={u.n}
              style={{ "--i": idx } as CSSProperties}
              className="group animate-fade-up hover-lift relative flex flex-col gap-3 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-5 transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-[var(--shadow-md)] data-[locked=true]:opacity-70"
              data-locked={!u.available || undefined}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  U{u.n.toString().padStart(2, "0")}
                </span>
                {u.available ? (
                  <Badge variant="success" size="sm">
                    Disponible
                  </Badge>
                ) : (
                  <Badge variant="secondary" size="sm">
                    Próximo
                  </Badge>
                )}
              </div>
              <h3 className="text-[15px] font-semibold leading-snug tracking-tight">
                {u.title}
              </h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {u.topics.slice(0, 3).map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span
                      className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
                      aria-hidden
                    />
                    <span className="truncate">{t}</span>
                  </li>
                ))}
                {u.topics.length > 3 ? (
                  <li className="text-muted-foreground/60">
                    + {u.topics.length - 3} más
                  </li>
                ) : null}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
