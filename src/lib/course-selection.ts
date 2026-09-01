import { cookies, headers } from "next/headers";

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

/**
 * Header interno que el middleware pone en cada request a
 * `/app/c/[courseSlug]/...` con el slug de la URL, ANTES de que el Server
 * Layout corra.
 *
 * Existe porque escribir la cookie en el middleware (`response.cookies.set`)
 * no es visible de forma confiable al Server Layout dentro de la MISMA
 * request en todas las versiones de Next: es una escritura para la
 * respuesta, no una garantía de lectura inmediata. Un header de request sí
 * lo es (`NextResponse.next({ request: { headers } })` reemplaza los headers
 * que ve el resto del árbol de esta misma request), así que la URL llega al
 * layout por ahí, no por la cookie.
 */
export const COURSE_SLUG_HEADER = "x-cpp-ceti-course-slug";

/**
 * Curso de la URL actual, según lo puso el middleware para rutas
 * `/app/c/[courseSlug]/...`. `null` fuera de esas rutas: ahí la cookie
 * manda (ver `readSelectedCourseSlug`).
 */
export async function readCourseSlugFromRoute(): Promise<string | null> {
  const store = await headers();
  const value = store.get(COURSE_SLUG_HEADER)?.trim();
  return value && value.length > 0 ? value : null;
}

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
 * - `urlSlug` válido  → ÉSE, sin importar la cookie: en una ruta de curso la
 *   URL es la fuente de verdad inmediata (ver `COURSE_SLUG_HEADER`).
 * - Exactamente uno   → ése (no hay nada que elegir; no es una suposición).
 * - Varios            → el de la cookie si es válido; si no, hay que elegir.
 */
export function pickCourse<T extends { slug: string }>(
  courses: T[],
  cookieSlug: string | null,
  urlSlug?: string | null,
): { kind: "empty" } | { kind: "course"; course: T } | { kind: "choose" } {
  if (courses.length === 0) return { kind: "empty" };

  const fromUrl = urlSlug
    ? courses.find((c) => c.slug === urlSlug)
    : undefined;
  if (fromUrl) return { kind: "course", course: fromUrl };

  const remembered = cookieSlug
    ? courses.find((c) => c.slug === cookieSlug)
    : undefined;
  if (remembered) return { kind: "course", course: remembered };

  if (courses.length === 1) return { kind: "course", course: courses[0] };
  return { kind: "choose" };
}
