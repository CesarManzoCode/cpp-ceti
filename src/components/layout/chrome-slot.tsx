"use client";

import { usePathname } from "next/navigation";

/**
 * El reproductor de lecciones (/app/u/[unidad]/[leccion]) es una vista
 * de concentración: se queda con su propia cabecera y sin barra
 * inferior, para que nada compita con el contenido de estudio.
 */
export function ChromeSlot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isLessonPlayer =
    segments[0] === "app" && segments[1] === "u" && segments.length === 4;

  if (isLessonPlayer) return null;
  return <>{children}</>;
}
