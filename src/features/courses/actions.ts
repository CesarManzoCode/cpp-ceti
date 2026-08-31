"use server";

import { redirect } from "next/navigation";

import { ActionError, withActionErrorHandling } from "@/lib/action-error";
import { writeSelectedCourseSlug } from "@/lib/course-selection";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/get-session";

/**
 * Valida y recuerda el curso elegido.
 *
 * El slug se comprueba contra los cursos PUBLICADOS antes de guardarlo: la
 * cookie nunca puede terminar apuntando a un curso inexistente o inédito.
 */
const rememberCourse = withActionErrorHandling(
  "selectCourse",
  async (slug: string): Promise<string> => {
    await requireSession();

    const course = await db.course.findFirst({
      where: { slug, published: true },
      select: { slug: true },
    });
    if (!course) {
      throw new ActionError("Ese curso no está disponible");
    }

    await writeSelectedCourseSlug(course.slug);
    return course.slug;
  },
);

/**
 * Recuerda el curso y entra a él.
 *
 * El `redirect` va FUERA del wrapper de errores a propósito: Next señaliza
 * la redirección lanzando, y el wrapper lo confundiría con una falla real.
 */
export async function selectCourse(slug: string): Promise<never> {
  const target = await rememberCourse(slug);
  redirect(`/app/c/${target}`);
}
