import { permanentRedirect } from "next/navigation";

import { LEGACY_CPP_COURSE_SLUG } from "@/lib/courses";

/** URL legacy del banco de práctica: era el de C++ y sigue siéndolo. */
export default function LegacyPracticeListPage() {
  permanentRedirect(`/app/c/${LEGACY_CPP_COURSE_SLUG}/ejercicios`);
}
