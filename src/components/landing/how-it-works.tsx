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
      className="relative overflow-hidden border-b border-border/60 bg-surface-2/40 py-16 lg:py-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid-tight absolute inset-0 opacity-30 dark:opacity-20" />
      </div>

      <Reveal className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          align="left"
          eyebrow="cómo funciona"
          title={
            <>
              90% práctica ·{" "}
              <span className="text-gradient-primary">10% teoría.</span>
            </>
          }
          description="Porque programar se aprende programando: repasas el concepto y lo aplicas de inmediato."
          className="max-w-2xl"
        />

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-7 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-md)]"
            >
              {/* Línea vertical degradada como anclaje izquierdo */}
              <span
                aria-hidden
                className="absolute inset-y-6 left-0 w-px bg-gradient-to-b from-primary/60 via-primary/25 to-transparent transition-opacity group-hover:via-primary/40"
              />
              <span className="font-mono text-[28px] font-bold leading-none tabular-nums tracking-tight">
                <span className="text-gradient-primary">{s.n}</span>
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
