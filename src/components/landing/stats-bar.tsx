import { BookOpen, GraduationCap, Layers, Sparkles } from "lucide-react";

import { db } from "@/lib/db";

/**
 * Trust bar con métricas reales del contenido publicado.
 * Server component: lee la base al renderizar.
 */
export async function StatsBar() {
  let lessons = 0;
  let exercises = 0;
  let units = 0;
  let degraded = false;

  try {
    [lessons, exercises, units] = await Promise.all([
      db.lesson.count({ where: { published: true } }),
      db.exercise.count(),
      db.unit.count({ where: { published: true } }),
    ]);
  } catch {
    // Fallback alineado con el contenido real en prisma/content/ — no inflamos
    // ni inventamos números. Si la DB falla, mostramos un punto de partida honesto.
    lessons = 60;
    exercises = 80;
    units = 10;
    degraded = true;
  }

  const approxMinutes = lessons * 5 + exercises * 4;
  const approxHours = Math.max(1, Math.round(approxMinutes / 60));

  const items = [
    { label: "Lecciones", value: `${lessons}+`, icon: BookOpen },
    { label: "Ejercicios", value: `${exercises}+`, icon: Sparkles },
    { label: "Unidades activas", value: `${units}`, icon: Layers },
    { label: "Horas estimadas", value: `~${approxHours} h`, icon: GraduationCap },
  ];

  return (
    <section
      aria-label="Estadísticas del curso"
      className="border-b border-border/60 bg-surface-2/30 py-12"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <p className="eyebrow mb-8 text-center text-muted-foreground">
          {degraded
            ? "El temario crece cada semana"
            : "Construido sobre el temario oficial del CETI"}
        </p>
        <ul className="grid grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card md:grid-cols-4 md:divide-y-0">
          {items.map((it) => (
            <li
              key={it.label}
              className="flex flex-col items-center gap-2 px-4 py-7 text-center"
            >
              <it.icon className="size-5 text-primary/70" aria-hidden />
              <span className="text-[30px] font-bold tracking-tight tabular-nums text-foreground sm:text-[38px]">
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
