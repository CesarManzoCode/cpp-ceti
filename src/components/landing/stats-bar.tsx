import { getLandingStats } from "@/components/landing/queries";

/**
 * Trust bar editorial: solo números reales del temario publicado.
 * Sin iconos decorativos — los números cargan el peso visual.
 */
export async function StatsBar() {
  const { lessons, exercises, units, degraded } = await getLandingStats();

  const items = [
    { label: "Unidades", value: `${units}` },
    { label: "Lecciones", value: `${lessons}+` },
    { label: "Ejercicios", value: `${exercises}+` },
    { label: "Costo", value: "Gratis" },
  ];

  return (
    <section
      aria-label="Resumen del curso"
      className="border-b border-border/60 bg-surface-2/30 py-10 sm:py-14"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <p className="eyebrow mb-7 text-center text-muted-foreground">
          {degraded
            ? "El temario crece cada semana"
            : "Construido sobre el temario oficial del CETI"}
        </p>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border/70 md:grid-cols-4">
          {items.map((it) => (
            <li
              key={it.label}
              className="flex flex-col items-center gap-1.5 bg-card px-4 py-6 text-center"
            >
              <span className="text-[30px] font-bold leading-none tracking-tight tabular-nums text-foreground sm:text-[36px]">
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
