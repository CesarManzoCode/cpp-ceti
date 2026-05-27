import type { CSSProperties } from "react";
import { CircleDot, PlayCircle, Trophy } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    n: "01",
    icon: PlayCircle,
    title: "Lecciones de 5 minutos",
    body: "Un concepto a la vez. Sin teoría infinita. Cada idea va acompañada de un ejemplo que puedes correr.",
  },
  {
    n: "02",
    icon: CircleDot,
    title: "Práctica inmediata",
    body: "Cada lección termina con un ejercicio que TÚ escribes. La plataforma lo compila y te da feedback al instante.",
  },
  {
    n: "03",
    icon: Trophy,
    title: "Progreso visible",
    body: "Tus XP, tu racha y tu avance por unidad. Vuelve cuando quieras y sigue donde lo dejaste.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como"
      className="relative border-b border-border/60 bg-surface-2/40 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          align="center"
          eyebrow="cómo_funciona"
          title="90% práctica · 10% teoría"
          description="Porque programar se aprende programando — no escuchando."
          className="mx-auto items-center"
        />

        <ol
          data-stagger
          style={{ "--stagger": "90ms" } as CSSProperties}
          className="relative mt-14 grid gap-6 md:grid-cols-3"
        >
          {/* Decorative connecting line on desktop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />
          {steps.map((s, idx) => (
            <li
              key={s.n}
              style={{ "--i": idx } as CSSProperties}
              className="animate-fade-up hover-lift relative flex flex-col gap-4 rounded-[var(--radius-xl)] border border-border bg-card p-7 transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-grid size-9 place-items-center rounded-full border border-primary/30 bg-primary-soft font-mono text-xs font-bold text-primary-soft-foreground">
                  {s.n}
                </span>
                <s.icon
                  className="size-4 text-muted-foreground"
                  aria-hidden
                />
              </div>
              <h3 className="text-[17px] font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
