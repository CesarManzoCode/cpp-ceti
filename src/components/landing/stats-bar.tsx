import { getLandingStats } from "@/components/landing/queries";

/**
 * Cifras reales del curso, leídas de la base de datos. Se presentan como
 * una línea de lecturas monoespaciadas —no como cuatro tarjetas con
 * icono— porque son datos de inventario, no argumentos de venta.
 */
export async function StatsBar() {
  const { lessons, exercises, units, degraded } = await getLandingStats();

  const items = [
    { label: "unidades", value: `${units}` },
    { label: "lecciones", value: `${lessons}` },
    { label: "ejercicios", value: `${exercises}` },
    { label: "costo", value: "$0" },
  ];

  return (
    <section
      aria-label="Resumen del curso"
      className="border-b border-border bg-surface-2"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-4 px-5 py-5 sm:px-6">
        <p className="label-micro text-muted-foreground">
          {degraded
            ? "El temario crece cada semana"
            : "Sobre el temario oficial del CETI"}
        </p>
        <span aria-hidden className="hidden h-px flex-1 bg-border sm:block" />
        <ul className="flex flex-wrap items-baseline gap-x-7 gap-y-3">
          {items.map((it) => (
            <li key={it.label} className="flex items-baseline gap-2">
              <span className="font-mono text-[19px] font-medium leading-none tabular-nums text-foreground">
                {it.value}
              </span>
              <span className="label-micro text-muted-foreground">
                {it.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
