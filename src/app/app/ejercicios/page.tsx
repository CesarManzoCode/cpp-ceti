import { permanentRedirect } from "next/navigation";

import { legacyRedirect } from "@/lib/courses";

/** URL legacy del banco de práctica: era el de C++ y sigue siéndolo. */
export default function LegacyPracticeListPage() {
  permanentRedirect(legacyRedirect.practiceList());
}
