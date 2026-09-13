import { cache } from "react";

import { formatSemesterSummary } from "@/lib/curriculum";
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

/**
 * Sólo se usa si la base no responde. Es una cota BAJA deliberada del
 * inventario accesible: si el contenido crece, la cifra real sube; nunca
 * al revés. Prometer de más en una pantalla de inventario es peor que
 * quedarse corto.
 */
const FALLBACK_STATS: Omit<LandingStats, "degraded"> = {
  lessons: 269,
  exercises: 211,
  units: 54,
};

/**
 * Inventario del contenido ACCESIBLE.
 *
 * La publicación es jerárquica: una lección publicada bajo una unidad
 * "Próximamente" no la puede abrir nadie, así que tampoco se cuenta.
 * Antes se contaban todas las lecciones publicadas y TODOS los ejercicios,
 * y el alumno no podía reconciliar el número con lo que veía en el temario.
 */
export const getLandingStats = cache(async (): Promise<LandingStats> => {
  try {
    const accessibleUnit = { published: true, course: { published: true } };
    const [lessons, exercises, units] = await Promise.all([
      db.lesson.count({ where: { published: true, unit: accessibleUnit } }),
      db.exercise.count({
        where: { step: { lesson: { published: true, unit: accessibleUnit } } },
      }),
      db.unit.count({ where: accessibleUnit }),
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
  description: string;
  subjectName: string;
  language: string;
  curriculumSummary: string | null;
  /** Publicadas y accesibles. `null` cuando la base no respondió. */
  lessonCount: number | null;
  exerciseCount: number | null;
  units: LandingUnit[];
}

const FALLBACK_CPP_UNITS: LandingUnit[] = [
  { slug: "primer-programa", order: 1, title: "Tu primer programa en C++", published: true },
  { slug: "variables-y-tipos", order: 2, title: "Variables y tipos de datos", published: true },
  { slug: "leer-datos", order: 3, title: "Leer datos del usuario con cin", published: true },
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
  { slug: "csharp-poo-03-uml", order: 3, title: "UML como contrato de código", published: true },
  { slug: "csharp-poo-04-relaciones", order: 4, title: "Relaciones entre clases", published: true },
  { slug: "csharp-poo-05-herencia", order: 5, title: "Herencia y polimorfismo", published: true },
  { slug: "csharp-poo-06-diseno-robusto", order: 6, title: "Responsabilidades y diseño robusto", published: true },
  { slug: "csharp-poo-07-gui", order: 7, title: "Aplicaciones de escritorio con Windows Forms", published: false },
  { slug: "csharp-poo-08-integrador", order: 8, title: "Proyecto integrador", published: false },
  { slug: "csharp-poo2-01-colecciones", order: 9, title: "Colecciones y estructuras lineales", published: true },
  { slug: "csharp-poo2-02-diccionarios", order: 10, title: "Diccionarios de objetos", published: true },
  { slug: "csharp-poo2-03-ordenamiento", order: 11, title: "Ordenamiento y búsqueda de objetos", published: true },
  { slug: "csharp-poo2-04-xml", order: 12, title: "XML y persistencia", published: true },
  { slug: "csharp-poo2-05-genericos", order: 13, title: "Clases y métodos genéricos", published: true },
  { slug: "csharp-poo2-06-concurrencia", order: 14, title: "Concurrencia e hilos", published: true },
  { slug: "csharp-poo2-07-redes", order: 15, title: "Redes, protocolos y sockets", published: true },
  { slug: "csharp-poo2-08-integrador", order: 16, title: "Proyecto integrador: inventario distribuido", published: true },
];

const FALLBACK_MODELOS_METODOS_UNITS: LandingUnit[] = [
  { slug: "mm-01-proyecto-cascada", order: 1, title: "Del programa al proyecto: modelo en cascada", published: true },
  { slug: "mm-02-requerimientos", order: 2, title: "Requerimientos, alcance y criterios de aceptación", published: true },
  { slug: "mm-03-uml-diseno", order: 3, title: "UML, responsabilidades y diseño", published: true },
  { slug: "mm-04-git-versiones", order: 4, title: "Git y control de versiones", published: true },
  { slug: "mm-05-planificacion-implementacion", order: 5, title: "Planificación, tareas e implementación", published: true },
  { slug: "mm-06-pruebas-calidad", order: 6, title: "Pruebas, verificación y calidad", published: true },
  { slug: "mm-07-mantenimiento", order: 7, title: "Mantenimiento y evolución segura", published: true },
  { slug: "mm-08-solid", order: 8, title: "SOLID aplicado a código mantenible", published: true },
  { slug: "mm-09-incremental", order: 9, title: "Desarrollo incremental e iterativo", published: true },
  { slug: "mm-10-integrador", order: 10, title: "Proyecto integrador", published: true },
];

const FALLBACK_BASES_DE_DATOS_UNITS: LandingUnit[] = [
  { slug: "bd1-01-fundamentos-sgbd", order: 1, title: "Información, bases de datos y SGBD", published: true },
  { slug: "bd1-02-requerimientos-informacion", order: 2, title: "Requerimientos de información", published: true },
  { slug: "bd1-03-modelo-er", order: 3, title: "Modelo Entidad-Relación", published: true },
  { slug: "bd1-04-modelo-relacional", order: 4, title: "Del modelo ER al modelo relacional", published: true },
  { slug: "bd1-05-normalizacion", order: 5, title: "Normalización", published: true },
  { slug: "bd1-06-algebra-relacional", order: 6, title: "Álgebra relacional", published: true },
  { slug: "bd1-07-ddl", order: 7, title: "DDL: construir la estructura", published: true },
  { slug: "bd1-08-dml", order: 8, title: "DML: insertar, modificar y eliminar", published: true },
  { slug: "bd1-09-consultas-reportes", order: 9, title: "Consultas SQL y reportes", published: true },
  { slug: "bd1-10-respaldo-integrador", order: 10, title: "Respaldo, restauración y proyecto integrador", published: true },
  { slug: "bd2-11-procedimientos", order: 11, title: "Procedimientos almacenados y modularización", published: true },
  { slug: "bd2-12-triggers-jobs", order: 12, title: "Triggers y automatización programada", published: true },
  { slug: "bd2-13-transacciones", order: 13, title: "Transacciones y modelo ACID", published: true },
  { slug: "bd2-14-usuarios-permisos", order: 14, title: "Usuarios, roles, privilegios y permisos", published: true },
  { slug: "bd2-15-mantenimiento", order: 15, title: "Mantenimiento y fragmentación", published: true },
  { slug: "bd2-16-conexiones", order: 16, title: "Conectar aplicaciones con bases de datos", published: true },
  { slug: "bd2-17-crud-interfaz", order: 17, title: "CRUD, vistas e informes desde una aplicación", published: true },
  { slug: "bd2-18-nosql-modelo", order: 18, title: "Pensar en documentos y colecciones", published: true },
  { slug: "bd2-19-mongodb-crud", order: 19, title: "CRUD en una base documental", published: true },
  { slug: "bd2-20-integrador", order: 20, title: "Proyecto integrador de Base de Datos II", published: true },
];

/**
 * Sólo se usa si la base no responde: el temario nunca queda en blanco.
 * `lessonCount`/`exerciseCount` quedan en `null` a propósito — inventar un
 * número aquí sería justo el tipo de cifra que erosiona confianza que este
 * blueprint pide evitar (sección C1). La UI oculta esa fila en vez de
 * mostrar un cero falso.
 */
const FALLBACK_COURSES: LandingCourse[] = [
  {
    slug: "cpp-desde-cero",
    title: "C++ desde cero",
    description:
      "El curso completo de C++ pensado para estudiantes del CETI Guadalajara. Cada concepto va seguido de práctica inmediata.",
    subjectName: "Programación en C++",
    language: "cpp",
    curriculumSummary: null,
    lessonCount: null,
    exerciseCount: null,
    units: FALLBACK_CPP_UNITS,
  },
  {
    slug: "csharp-poo-1",
    title: "Programación Orientada a Objetos con C#",
    description:
      "Modela, implementa y conecta aplicaciones orientadas a objetos en C#, desde clases y relaciones hasta colecciones, persistencia, concurrencia y redes.",
    subjectName: "Programación Orientada a Objetos",
    language: "csharp",
    curriculumSummary: "Semestres 3 y 4",
    lessonCount: null,
    exerciseCount: null,
    units: FALLBACK_CSHARP_UNITS,
  },
  {
    slug: "modelos-metodos-desarrollo-software",
    title: "Modelos y métodos de desarrollo de software",
    description:
      "Convierte problemas en proyectos de software trazables: requisitos, diseño, control de versiones, pruebas, mantenimiento, SOLID y entregas incrementales.",
    subjectName: "Modelos y métodos de desarrollo de software",
    language: "csharp",
    curriculumSummary: null,
    lessonCount: null,
    exerciseCount: null,
    units: FALLBACK_MODELOS_METODOS_UNITS,
  },
  {
    slug: "bases-de-datos",
    title: "Bases de datos",
    description:
      "Diseña bases relacionales desde necesidades reales, normalízalas y consulta información con SQL.",
    subjectName: "Bases de datos",
    language: "sql",
    curriculumSummary: null,
    lessonCount: null,
    exerciseCount: null,
    units: FALLBACK_BASES_DE_DATOS_UNITS,
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
        id: true,
        slug: true,
        title: true,
        description: true,
        subjectName: true,
        language: true,
        curriculumSections: {
          orderBy: { order: "asc" },
          select: { semester: true },
        },
        units: {
          orderBy: { order: "asc" },
          select: {
            slug: true,
            order: true,
            title: true,
            published: true,
            _count: { select: { lessons: { where: { published: true } } } },
          },
        },
      },
    });

    if (courses.length === 0) return FALLBACK_COURSES;

    // Publicadas y dentro de una unidad accesible: el mismo criterio que
    // `getLandingStats`, ahora por curso — el temario nunca puede contradecir
    // al contador de arriba.
    const exerciseCounts = await Promise.all(
      courses.map((c) =>
        db.exercise.count({
          where: {
            step: {
              lesson: {
                published: true,
                unit: { published: true, courseId: c.id },
              },
            },
          },
        }),
      ),
    );

    return courses.map((course, i) => ({
      slug: course.slug,
      title: course.title,
      description: course.description,
      subjectName: course.subjectName,
      language: course.language,
      curriculumSummary: formatSemesterSummary(
        course.curriculumSections.map((s) => s.semester),
      ),
      lessonCount: course.units
        .filter((u) => u.published)
        .reduce((n, u) => n + u._count.lessons, 0),
      exerciseCount: exerciseCounts[i],
      units: course.units.map((u) => ({
        slug: u.slug,
        order: u.order,
        title: u.title,
        published: u.published,
      })),
    }));
  } catch {
    return FALLBACK_COURSES;
  }
});
