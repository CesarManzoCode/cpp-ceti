import { cookies } from "next/headers";

/**
 * Curso seleccionado.
 *
 * La cookie es una COMODIDAD: recuerda el último curso que el alumno abrió
 * para no obligarlo a elegir en cada visita. NO es autoridad: su valor se
 * valida siempre contra los cursos publicados, y si no corresponde a
 * ninguno se ignora.
 *
 * Cuando no hay selección válida y hay más de un curso, la app muestra la
 * pantalla de selección. Nunca elige "el primero que ordene": esa decisión
 * silenciosa es justo la que llevaría a un alumno de C# al curso de C++.
 */
export const COURSE_COOKIE = "cpp-ceti.course";

/** Un año: la selección es una preferencia, no una sesión. */
const COURSE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function readSelectedCourseSlug(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(COURSE_COOKIE)?.value?.trim();
  return value && value.length > 0 ? value : null;
}

/** Escribe la selección. Sólo desde una Server Action o route handler. */
export async function writeSelectedCourseSlug(slug: string): Promise<void> {
  const store = await cookies();
  store.set(COURSE_COOKIE, slug, {
    path: "/",
    maxAge: COURSE_COOKIE_MAX_AGE,
    sameSite: "lax",
    httpOnly: false,
  });
}

export interface CourseChoice {
  id: string;
  slug: string;
  title: string;
  description: string;
  subjectName: string;
  academicContext: string;
  language: string;
}

/**
 * Elige el curso a mostrar entre los publicados.
 *
 * - Ninguno publicado → `{ kind: "empty" }`.
 * - Exactamente uno   → ése (no hay nada que elegir; no es una suposición).
 * - Varios            → el de la cookie si es válido; si no, hay que elegir.
 */
export function pickCourse<T extends { slug: string }>(
  courses: T[],
  selectedSlug: string | null,
): { kind: "empty" } | { kind: "course"; course: T } | { kind: "choose" } {
  if (courses.length === 0) return { kind: "empty" };

  const remembered = selectedSlug
    ? courses.find((c) => c.slug === selectedSlug)
    : undefined;
  if (remembered) return { kind: "course", course: remembered };

  if (courses.length === 1) return { kind: "course", course: courses[0] };
  return { kind: "choose" };
}
