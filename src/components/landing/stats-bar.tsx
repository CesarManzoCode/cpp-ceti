import { BookOpen, Code2, Layers, Sparkles } from "lucide-react";

import { getLandingStats } from "@/components/landing/queries";

/**
 * Trust bar editorial: 4 columnas con número grande tipo "metric" + ícono
 * y eyebrow. Aurora muy sutil de fondo para amarrar con el hero.
 */
export async function StatsBar() {
  const { lessons, exercises, units, degraded } = await getLandingStats();

  const items = [
    { label: "Unidades", value: `${units}`, icon: Layers },
    { label: "Lecciones", value: `${lessons}+`, icon: BookOpen },
    { label: "Ejercicios", value: `${exercises}+`, icon: Code2 },
    { label: "Costo", value: "Gratis", icon: Sparkles },
  ];

  return (
    <section
      aria-label="Resumen del curso"
      className="relative overflow-hidden border-b border-border/60 bg-surface-2/30 py-12 sm:py-16"
    >
      {/* Aurora muy diluida para amarrar con el hero */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora absolute inset-0 opacity-25 dark:opacity-30" />
      </div>

      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <p className="eyebrow mb-8 text-center text-muted-foreground">
          {degraded
            ? "El temario crece cada semana"
            : "Construido sobre el temario oficial del CETI"}
        </p>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border/70 md:grid-cols-4">
          {items.map((it) => (
            <li
              key={it.label}
              className="group relative flex flex-col items-center gap-2 bg-card px-4 py-7 text-center transition-colors hover:bg-surface-2/50"
            >
              <span className="grid size-9 place-items-center rounded-[var(--radius-md)] bg-primary-soft/70 text-primary-soft-foreground transition-transform duration-200 group-hover:scale-110">
                <it.icon className="size-4" aria-hidden />
              </span>
              <span className="text-[32px] font-bold leading-none tracking-tight tabular-nums text-foreground sm:text-[40px]">
                {it.value}
              </span>
              <span className="eyebrow text-muted-foreground">{it.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
