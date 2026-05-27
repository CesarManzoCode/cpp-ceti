import type { CSSProperties } from "react";
import { CircleDot, PlayCircle, Trophy } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    n: "01",
    icon: PlayCircle,
    title: "Lecciones de 5 minutos",
    body: "Un concepto a la vez. Sin teoría infinita. Cada idea va acompañada de un ejemplo que puedes correr en el navegador.",
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
          eyebrow="cómo funciona"
          title="90% práctica · 10% teoría"
          description="Porque programar se aprende programando — no escuchando."
          className="mx-auto items-center"
        />

        <ol
          data-stagger
          style={{ "--stagger": "90ms" } as CSSProperties}
          className="relative mt-14 grid gap-6 md:grid-cols-3"
        >
          {/* Connecting line on desktop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-12 top-9 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />
          {steps.map((s, idx) => (
            <li
              key={s.n}
              style={{ "--i": idx } as CSSProperties}
              className="animate-fade-up relative flex flex-col gap-4 rounded-[var(--radius-xl)] border border-border bg-card p-7 shadow-[var(--shadow-xs)] transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground font-bold shadow-[0_6px_16px_-4px_var(--primary)]">
                  <span className="font-mono text-sm">{s.n}</span>
                </span>
                <s.icon className="size-5 text-muted-foreground" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">
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
