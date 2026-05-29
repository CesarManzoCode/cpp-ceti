import { cache } from "react";

import { db } from "@/lib/db";

/**
 * Queries que alimentan a los server components del landing page.
 * Viven aquí (no en `src/features/`) porque el landing no es un dominio
 * con actions ni progreso de usuario — es solo presentación pública.
 * Mantener las queries en un único archivo del cluster facilita el
 * fallback común a contenido estático cuando la DB no está disponible.
 */

export interface LandingStats {
  lessons: number;
  exercises: number;
  units: number;
  degraded: boolean;
}

const FALLBACK_STATS: Omit<LandingStats, "degraded"> = {
  lessons: 60,
  exercises: 80,
  units: 10,
};

export const getLandingStats = cache(async (): Promise<LandingStats> => {
  try {
    const [lessons, exercises, units] = await Promise.all([
      db.lesson.count({ where: { published: true } }),
      db.exercise.count(),
      db.unit.count({ where: { published: true } }),
    ]);
    return { lessons, exercises, units, degraded: false };
  } catch {
    return { ...FALLBACK_STATS, degraded: true };
  }
});

export interface LandingUnit {
  slug: string;
  order: number;
  title: string;
  published: boolean;
}

const FALLBACK_UNITS: LandingUnit[] = [
  { slug: "primer-programa", order: 1, title: "Tu primer programa en C++", published: true },
  { slug: "leer-datos", order: 2, title: "Leer datos del usuario con cin", published: true },
  { slug: "variables-y-tipos", order: 3, title: "Variables y tipos de datos", published: true },
  { slug: "control-de-flujo", order: 4, title: "Control de flujo", published: true },
  { slug: "loops", order: 5, title: "Ciclos: repetir sin escribir cien veces", published: true },
  { slug: "funciones", order: 6, title: "Funciones: empaquetar tu código", published: true },
  { slug: "printf-scanf", order: 7, title: "printf y scanf: la forma C de imprimir y leer", published: true },
  { slug: "arreglos", order: 8, title: "Arreglos: muchos valores en una sola variable", published: true },
  { slug: "archivos", order: 9, title: "Archivos: guardar y leer datos del disco", published: true },
  { slug: "matrices", order: 10, title: "Matrices: arreglos en dos dimensiones", published: true },
];

export const getLandingUnits = cache(async (): Promise<LandingUnit[]> => {
  try {
    const units = await db.unit.findMany({
      where: { course: { slug: "cpp-desde-cero" } },
      orderBy: { order: "asc" },
      select: { slug: true, order: true, title: true, published: true },
    });
    return units.length > 0 ? units : FALLBACK_UNITS;
  } catch {
    return FALLBACK_UNITS;
  }
});
