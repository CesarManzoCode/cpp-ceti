import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    n: "01",
    title: "Lecciones de 5 minutos",
    body: "Un concepto a la vez. Sin teoría infinita. Cada idea viene con un ejemplo que puedes correr en el navegador.",
  },
  {
    n: "02",
    title: "Práctica inmediata",
    body: "Cada lección termina con un ejercicio que TÚ escribes. La plataforma lo compila y te da feedback al instante.",
  },
  {
    n: "03",
    title: "Progreso visible",
    body: "Tus XP, tu racha y tu avance por unidad. Vuelve cuando quieras y sigue donde lo dejaste.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como"
      className="border-b border-border/60 bg-surface-2/60 py-16 lg:py-24"
    >
      <Reveal className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          align="left"
          eyebrow="cómo funciona"
          title="90% práctica · 10% teoría"
          description="Porque programar se aprende programando — no escuchando."
          className="max-w-2xl"
        />

        <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-12 top-[34px] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />
          {steps.map((s) => (
            <li
              key={s.n}
              className="relative flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-7"
            >
              <span className="font-mono text-sm font-semibold tabular-nums text-primary">
                {s.n}
              </span>
              <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
