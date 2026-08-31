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

export interface LandingCourse {
  slug: string;
  title: string;
  subjectName: string;
  language: string;
  units: LandingUnit[];
}

const FALLBACK_CPP_UNITS: LandingUnit[] = [
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

const FALLBACK_CSHARP_UNITS: LandingUnit[] = [
  { slug: "csharp-poo-01-modelar", order: 1, title: "De problemas a objetos", published: true },
  { slug: "csharp-poo-02-encapsular", order: 2, title: "Encapsulamiento y constructores", published: true },
  { slug: "csharp-poo-03-uml", order: 3, title: "UML como contrato del código", published: true },
  { slug: "csharp-poo-04-relaciones", order: 4, title: "Relaciones entre clases", published: true },
  { slug: "csharp-poo-05-herencia", order: 5, title: "Herencia y polimorfismo", published: true },
  { slug: "csharp-poo-06-diseno-robusto", order: 6, title: "Responsabilidades y diseño robusto", published: true },
  { slug: "csharp-poo-07-gui", order: 7, title: "Aplicaciones de escritorio con Windows Forms", published: true },
  { slug: "csharp-poo-08-integrador", order: 8, title: "Proyecto integrador", published: true },
];

/** Sólo se usa si la base no responde: el temario nunca queda en blanco. */
const FALLBACK_COURSES: LandingCourse[] = [
  {
    slug: "cpp-desde-cero",
    title: "C++ desde cero",
    subjectName: "Programación en C++",
    language: "cpp",
    units: FALLBACK_CPP_UNITS,
  },
  {
    slug: "csharp-poo-1",
    title: "Programación Orientada a Objetos I con C#",
    subjectName: "Programación Orientada a Objetos I",
    language: "csharp",
    units: FALLBACK_CSHARP_UNITS,
  },
];

/**
 * Temario público, POR CURSO.
 *
 * Antes esto devolvía las unidades de C++ y nada más. Con dos cursos eso
 * escondía uno entero del temario, y encima contradecía al contador de
 * arriba, que sí cuenta todo. El temario tiene que listar lo mismo que
 * dice el contador.
 */
export const getLandingCourses = cache(async (): Promise<LandingCourse[]> => {
  try {
    const courses = await db.course.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { slug: "asc" }],
      select: {
        slug: true,
        title: true,
        subjectName: true,
        language: true,
        units: {
          orderBy: { order: "asc" },
          select: { slug: true, order: true, title: true, published: true },
        },
      },
    });
    return courses.length > 0 ? courses : FALLBACK_COURSES;
  } catch {
    return FALLBACK_COURSES;
  }
});
