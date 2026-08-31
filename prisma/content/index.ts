import type { CourseDefinition } from "./types";

import { cursoCsharpPoo1 } from "./csharp";

import { unidad01 } from "./unidad-01-primer-programa";
import { unidadCin } from "./unidad-02-cin";
import { unidadVariables } from "./unidad-03-variables";
import { unidad04 } from "./unidad-04-control-flujo";
import { unidad05 } from "./unidad-05-loops";
import { unidad06 } from "./unidad-06-funciones";
import { unidad07 } from "./unidad-07-printf-scanf";
import { unidad08 } from "./unidad-08-arreglos";
import { unidad09 } from "./unidad-09-archivos";
import { unidad10 } from "./unidad-10-matrices";

export const cursoCpp: CourseDefinition = {
  // El slug es identidad histórica: NO se renombra. Todas las URLs viejas,
  // el progreso y los intentos de los alumnos cuelgan de él.
  slug: "cpp-desde-cero",
  title: "C++ desde cero",
  description:
    "El curso completo de C++ pensado para estudiantes del CETI Guadalajara. " +
    "Cada concepto va seguido de práctica inmediata.",
  subjectName: "Programación en C++",
  academicContext: "Curso introductorio CETI",
  language: "cpp",
  executionProfile: "cpp17-wandbox",
  // El ORDEN de este arreglo es el orden del curso (el seed numera por
  // posición). "Variables y tipos" va ANTES de "Leer datos con cin": la
  // unidad de `cin` ya usaba `int`, `double`, `string`, aritmética y
  // `setprecision`, es decir, exactamente lo que la de variables enseña.
  // Los slugs NO cambian —`leer-datos` y `variables-y-tipos` siguen siendo
  // los mismos recursos, con el mismo progreso y los mismos enlaces—; lo
  // único que cambia es en qué posición aparecen.
  units: [
    unidad01,
    unidadVariables,
    unidadCin,
    unidad04,
    unidad05,
    unidad06,
    unidad07,
    unidad08,
    unidad09,
    unidad10,
  ],
};

/**
 * Registro de cursos. El orden aquí es el orden de presentación por default
 * en el selector de curso. Cada curso es independiente: su progreso, sus
 * unidades, sus prácticas y su compilador.
 */
export const allCourses: CourseDefinition[] = [cursoCpp, cursoCsharpPoo1];
