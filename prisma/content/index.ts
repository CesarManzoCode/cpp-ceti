import type { CourseDefinition } from "./types";

import { cppDesdeCero } from "./courses/cpp-desde-cero";
import { allCourses as canonicalAllCourses } from "./courses";

/**
 * Alias legacy: el curso de C++ tal como lo exponía este archivo antes de
 * la capa de authoring (`./authoring.ts`, `./courses/`). El slug es
 * identidad histórica y no cambia; el valor ahora sale del registry
 * canónico en vez de definirse aquí, pero es el mismo curso.
 */
export const cursoCpp: CourseDefinition = cppDesdeCero.course;

/**
 * Registro de cursos. Ahora se construye en `./courses` a partir de
 * `buildContentRegistry`; este re-export existe para no romper a los
 * consumidores actuales (`prisma/seed-content.ts`, tests).
 */
export const allCourses: CourseDefinition[] = canonicalAllCourses;
