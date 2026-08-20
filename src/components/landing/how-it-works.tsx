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

        <ol className="gutter-list mt-12 border-y border-border">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="gutter-row border-t border-border first:border-t-0"
            >
              <span className="flex items-start justify-center pr-3 pt-5">
                <span
                  aria-hidden
                  className="font-mono text-[13px] tabular-nums text-primary"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="py-5 pl-4 md:flex md:gap-8">
                <span className="block text-[17px] font-semibold leading-snug md:w-64 md:shrink-0">
                  {s.title}
                </span>
                <span className="mt-2 block max-w-[54ch] text-[15px] leading-relaxed text-muted-foreground md:mt-0">
                  {s.body}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
