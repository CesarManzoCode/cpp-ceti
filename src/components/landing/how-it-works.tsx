import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    title: "Lecciones de 5 minutos",
    body: "Un concepto a la vez. Cada idea viene con un ejemplo que puedes correr en el navegador.",
  },
  {
    title: "Práctica inmediata",
    body: "Cada lección termina con un ejercicio que tú escribes. La plataforma lo compila y te da feedback al instante.",
  },
  {
    title: "Progreso visible",
    body: "Tus XP, tu racha y tu avance por unidad. Vuelve cuando quieras y sigue donde lo dejaste.",
  },
];

export function HowItWorks() {
  return (
    <section id="como" className="border-b border-border bg-surface-2 py-14 lg:py-20">
      <Reveal className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          eyebrow="Cómo funciona"
          title="90% práctica, 10% teoría."
          description="Porque programar se aprende programando: repasas el concepto y lo aplicas de inmediato."
        />

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-[var(--shadow-xs)]"
            >
              <span
                aria-hidden
                className="grid size-10 place-items-center rounded-[var(--radius-md)] bg-primary text-[17px] font-extrabold tabular-nums text-primary-foreground"
              >
                {i + 1}
              </span>
              <h3 className="mt-4 text-[18px] font-bold leading-snug">
                {s.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
