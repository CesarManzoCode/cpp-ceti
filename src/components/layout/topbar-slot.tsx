"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the global Topbar inside the lesson player (/app/u/[unit]/[lesson])
 * so the lesson keeps a single, focused top bar instead of stacking two.
 * The lesson route is the only place its own sticky header takes over.
 */
export function TopbarSlot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isLessonPlayer =
    segments[0] === "app" && segments[1] === "u" && segments.length === 4;

  if (isLessonPlayer) return null;
  return <>{children}</>;
}
