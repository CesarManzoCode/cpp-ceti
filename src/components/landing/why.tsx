import { BookX, Code2, GraduationCap } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const problems = [
  {
    icon: Code2,
    title: "Ver no es lo mismo que escribir",
    body: "Seguir un ejemplo en clase es el primer paso. Escribir el código tú mismo —equivocarte y corregir— es lo que hace que el concepto se quede.",
  },
  {
    icon: BookX,
    title: "Mimo no tiene C++",
    body: "Sololearn, Codecademy, Mimo — ninguna enseña C++. Y menos en español.",
  },
  {
    icon: GraduationCap,
    title: "Repasa a tu ritmo",
    body: "Si un tema no te cayó a la primera, aquí lo practicas las veces que necesites, con pistas y feedback inmediato.",
  },
];

export function Why() {
  return (
    <section id="por-que" className="border-b border-border/60 py-20 lg:py-28">
      <Reveal className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          align="center"
          eyebrow="la idea"
          title={
            <>
              ¿Un tema de C++ no te quedó claro?{" "}
              <span className="text-muted-foreground">
                Aquí lo practicas hasta dominarlo.
              </span>
            </>
          }
          className="mx-auto max-w-2xl items-center"
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-3">
          {problems.map((p) => (
            <li
              key={p.title}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-7 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:border-border-strong hover:shadow-[var(--shadow-sm)]"
            >
              {/* Aura tonal en la esquina; sube en opacidad al hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-primary/10 opacity-50 blur-2xl transition-opacity duration-300 group-hover:opacity-90"
              />
              <span className="relative inline-grid size-11 place-items-center rounded-[var(--radius-md)] bg-primary-soft text-primary ring-1 ring-inset ring-primary/15 transition-transform duration-200 group-hover:scale-105">
                <p.icon className="size-5" aria-hidden />
              </span>
              <h3 className="relative text-[17px] font-semibold tracking-tight">{p.title}</h3>
              <p className="relative text-[15px] leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
