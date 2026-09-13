"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * Rutas de "modo aprendizaje" (blueprint UX/UI, sección D3): el
 * reproductor de lecciones y el banco de trabajo de un ejercicio/reto.
 * En ambas, el shell global (rail, topbar, bottom nav) desaparece por
 * completo y el propio reproductor pinta su Learning Bar — nada debe
 * competir por espacio con el editor y la consigna.
 *
 * OJO: esto tiene que reconocer la ruta CANÓNICA con curso
 * (`/app/c/<curso>/u/<unidad>/<leccion>` y
 * `/app/c/<curso>/ejercicios/<ejercicio>`), no la vieja sin curso — esa
 * nunca llega a renderizar: el middleware la redirige con 308 antes.
 */
const LESSON_PLAYER = /^\/app\/c\/[^/]+\/u\/[^/]+\/[^/]+\/?$/;
const PRACTICE_PLAYER = /^\/app\/c\/[^/]+\/ejercicios\/[^/]+\/?$/;

export function isLearningRoute(pathname: string): boolean {
  return LESSON_PLAYER.test(pathname) || PRACTICE_PLAYER.test(pathname);
}

/** Envuelve una pieza del shell (rail, topbar, bottom nav) y la oculta en modo aprendizaje. */
export function ChromeSlot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isLearningRoute(pathname)) return null;
  return <>{children}</>;
}

/**
 * `<main>` de la cáscara. Fuera de modo aprendizaje reserva el colchón
 * inferior de la bottom nav; en modo aprendizaje el reproductor tiene el
 * viewport completo, así que no hay nada que reservar.
 */
export function AppMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const learning = isLearningRoute(pathname);
  return (
    <main
      id="main-content"
      className={cn(
        "flex-1",
        !learning && "pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0",
      )}
    >
      {children}
    </main>
  );
}
