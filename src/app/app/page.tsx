import { redirect } from "next/navigation";

import { pickCourse, readSelectedCourseSlug } from "@/lib/course-selection";
import { getCourseChoices } from "@/features/courses/queries";
import { getSession } from "@/lib/get-session";

export const metadata = {
  title: "Tus cursos",
};

/**
 * Entrada de la app.
 *
 * Con un curso, entra directo. Con varios, entra al que el alumno eligió
 * la última vez. Elegir por él "el primero" es exactamente el error que
 * separa a un alumno de POO I de su curso: sin selección válida, esto
 * lleva a "Tus cursos", que es la superficie estable para decidir.
 *
 * `/app` NO es esa superficie: es un atajo. La pantalla que siempre se
 * puede abrir —desde el selector del rail y del móvil— es `/app/cursos`.
 */
export default async function AppEntryPage() {
  const session = await getSession();
  if (!session?.user) return null;

  const [courses, selectedSlug] = await Promise.all([
    getCourseChoices(),
    readSelectedCourseSlug(),
  ]);

  const decision = pickCourse(courses, selectedSlug);
  if (decision.kind === "course") {
    redirect(`/app/c/${decision.course.slug}`);
  }

  redirect("/app/cursos");
}
