import { permanentRedirect } from "next/navigation";

import { LEGACY_CPP_COURSE_SLUG } from "@/lib/courses";

/**
 * URL legacy de un ejercicio de práctica. El slug NO se renombra: el mismo
 * ejercicio, con el mismo id y los mismos intentos, bajo su curso.
 */
export default async function LegacyPracticePage({
  params,
}: {
  params: Promise<{ exerciseSlug: string }>;
}) {
  const { exerciseSlug } = await params;
  permanentRedirect(
    `/app/c/${LEGACY_CPP_COURSE_SLUG}/ejercicios/${exerciseSlug}`,
  );
}
