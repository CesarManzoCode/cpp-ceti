import type { CSSProperties } from "react";
import { BookX, Code2, GraduationCap } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";

const problems = [
  {
    icon: BookX,
    title: "El pizarrón no enseña",
    body: "Los maestros copian código sin explicar la lógica. Tú memorizas. Y el examen te cae encima.",
  },
  {
    icon: Code2,
    title: "Mimo no tiene C++",
    body: "Sololearn, Codecademy, Mimo — ninguna enseña C++. Y menos en español.",
  },
  {
    icon: GraduationCap,
    title: "Reprobar no es por flojera",
    body: "Es por falta de recursos. Esta plataforma te da lo que la escuela debería darte.",
  },
];

export function Why() {
  return (
    <section
      id="por-que"
      className="border-b border-border/60 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          align="center"
          eyebrow="el problema"
          title={
            <>
              En el CETI, C++ se reprueba en masa.{" "}
              <span className="text-muted-foreground">Y no es tu culpa.</span>
            </>
          }
          className="mx-auto max-w-2xl items-center"
        />

        <ul
          data-stagger
          style={{ "--stagger": "70ms" } as CSSProperties}
          className="mt-14 grid gap-5 sm:grid-cols-3"
        >
          {problems.map((p, idx) => (
            <li
              key={p.title}
              style={{ "--i": idx } as CSSProperties}
              className="animate-fade-up flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-7"
            >
              <span className="inline-grid size-10 place-items-center rounded-[var(--radius-md)] bg-surface-2 text-muted-foreground">
                <p.icon className="size-5" aria-hidden />
              </span>
              <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
