import { permanentRedirect } from "next/navigation";

import { LEGACY_CPP_COURSE_SLUG } from "@/lib/courses";

/**
 * URL legacy sin curso. Existió cuando la plataforma tenía un solo curso y
 * hay marcadores y enlaces compartidos apuntando aquí, así que se conserva
 * para siempre y redirige a la ruta canónica del MISMO recurso de C++.
 *
 * Ningún slug de C++ se renombra: la unidad es la misma, sólo cambia el
 * prefijo de la URL.
 */
export default async function LegacyUnitPage({
  params,
}: {
  params: Promise<{ unitSlug: string }>;
}) {
  const { unitSlug } = await params;
  permanentRedirect(`/app/c/${LEGACY_CPP_COURSE_SLUG}/u/${unitSlug}`);
}
