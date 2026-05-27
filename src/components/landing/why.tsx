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
          eyebrow="El problema"
          title={
            <>
              En el CETI, C++ se reprueba en masa.{" "}
              <span className="text-muted-foreground">Y no es tu culpa.</span>
            </>
          }
          className="mx-auto max-w-2xl items-center"
        />

        <ul className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-border bg-border sm:grid-cols-3">
          {problems.map((p) => (
            <li
              key={p.title}
              className="flex flex-col gap-3 bg-card p-7 transition-colors hover:bg-surface-2"
            >
              <span className="inline-grid size-9 place-items-center rounded-[var(--radius-md)] border border-border/70 bg-surface-2 text-foreground">
                <p.icon className="size-4" aria-hidden />
              </span>
              <h3 className="text-[17px] font-semibold tracking-tight">
                {p.title}
              </h3>
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
