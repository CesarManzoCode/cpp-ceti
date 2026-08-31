// =====================================================================
// Identidad de cursos.
//
// El curso es la raíz de todo: define lenguaje, compilador, navegación y
// el alcance del progreso. Este módulo concentra la única constante de
// identidad histórica que el código necesita conocer.
// =====================================================================

/**
 * Slug del curso de C++ existente desde el primer día. Es identidad
 * histórica: todas las URLs viejas (`/app/u/...`, `/app/ejercicios/...`),
 * el progreso, los intentos y las revisiones cuelgan de él. NO se renombra.
 *
 * Se usa para dos cosas y nada más:
 *   1. Resolver las rutas legacy sin curso a su curso real.
 *   2. El backfill de la migración `add_course_language`.
 *
 * No es "el curso por default": una selección ausente lleva a la pantalla
 * de selección de curso, no a C++.
 */
export const LEGACY_CPP_COURSE_SLUG = "cpp-desde-cero";
