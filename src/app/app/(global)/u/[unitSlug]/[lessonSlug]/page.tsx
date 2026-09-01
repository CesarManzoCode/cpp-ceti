import { permanentRedirect } from "next/navigation";

import { legacyRedirect } from "@/lib/courses";

/**
 * URL legacy sin curso hacia una lección de C++. Redirige a la ruta
 * canónica conservando el paso (`?p=N`), que es lo que hace que un enlace
 * a "el paso 4 de esta lección" siga sirviendo.
 */
export default async function LegacyLessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ unitSlug: string; lessonSlug: string }>;
  searchParams: Promise<{ p?: string }>;
}) {
  const { unitSlug, lessonSlug } = await params;
  const { p } = await searchParams;
  permanentRedirect(legacyRedirect.lesson(unitSlug, lessonSlug, p));
}
