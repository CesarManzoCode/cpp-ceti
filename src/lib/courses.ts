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

/**
 * Rutas canónicas de un curso. Todo enlace del producto sale de aquí o de
 * la misma plantilla: `/app/c/<curso>/...`.
 */
export const coursePath = {
  home: (courseSlug: string) => `/app/c/${courseSlug}`,
  unit: (courseSlug: string, unitSlug: string) =>
    `/app/c/${courseSlug}/u/${unitSlug}`,
  lesson: (courseSlug: string, unitSlug: string, lessonSlug: string) =>
    `/app/c/${courseSlug}/u/${unitSlug}/${lessonSlug}`,
  practiceList: (courseSlug: string) => `/app/c/${courseSlug}/ejercicios`,
  practice: (courseSlug: string, exerciseSlug: string) =>
    `/app/c/${courseSlug}/ejercicios/${exerciseSlug}`,
};

/**
 * Destino de una URL legacy sin curso.
 *
 * Toda ruta vieja pertenece al curso de C++ — era el único que existía
 * cuando esas URLs se acuñaron. El slug del recurso NO se toca: es el
 * mismo recurso, con el mismo id y el mismo progreso, bajo su curso.
 */
export const legacyRedirect = {
  unit: (unitSlug: string) => coursePath.unit(LEGACY_CPP_COURSE_SLUG, unitSlug),
  lesson: (unitSlug: string, lessonSlug: string, step?: string | null) => {
    const base = coursePath.lesson(LEGACY_CPP_COURSE_SLUG, unitSlug, lessonSlug);
    // El paso viaja en la URL: un enlace a "el paso 4 de esta lección"
    // tiene que seguir cayendo en el paso 4.
    return step ? `${base}?p=${encodeURIComponent(step)}` : base;
  },
  practiceList: () => coursePath.practiceList(LEGACY_CPP_COURSE_SLUG),
  practice: (exerciseSlug: string) =>
    coursePath.practice(LEGACY_CPP_COURSE_SLUG, exerciseSlug),
};
