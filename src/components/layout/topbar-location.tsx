"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import type { RoadmapUnit } from "@/features/roadmap/types";

const ACCOUNT_LABELS: Record<string, string> = {
  "/app": "Tus cursos",
  "/app/cursos": "Tus cursos",
  "/app/amigos": "Amigos",
  "/app/logros": "Logros",
  "/app/perfil": "Perfil",
};

/**
 * Quita el prefijo `/app/c/<curso>` para razonar sobre la ruta dentro del
 * curso. Devuelve también el inicio al que vuelve la migaja: el del curso
 * si lo hay, o la selección de cursos.
 */
function splitCourse(pathname: string): { home: string; rest: string[] } {
  const seg = pathname.split("/").filter(Boolean);
  if (seg[0] === "app" && seg[1] === "c" && seg[2]) {
    return { home: `/app/c/${seg[2]}`, rest: seg.slice(3) };
  }
  return { home: "/app", rest: seg.slice(1) };
}

function resolve(
  pathname: string,
  units: RoadmapUnit[],
): { label: string; hasParent: boolean; home: string } {
  const { home, rest } = splitCourse(pathname);

  const exact = ACCOUNT_LABELS[pathname];
  if (exact) {
    return { label: exact, hasParent: pathname !== "/app", home };
  }

  if (rest.length === 0) return { label: "Inicio", hasParent: false, home };
  if (rest[0] === "u" && rest[1]) {
    const unit = units.find((u) => u.slug === rest[1]);
    return { label: unit?.title ?? "Unidad", hasParent: true, home };
  }
  if (rest[0] === "ejercicios") {
    return {
      label: rest[1] ? "Ejercicio" : "Práctica",
      hasParent: true,
      home,
    };
  }
  if (rest[0] === "perfil" && rest[1]) {
    return { label: `@${rest[1]}`, hasParent: true, home };
  }
  return { label: "Inicio", hasParent: false, home };
}

/**
 * Dónde estoy. En móvil manda la marca (no hay rail que la muestre) y
 * en escritorio, el nombre de la pantalla con retorno a Inicio.
 */
export function TopbarLocation({ units }: { units: RoadmapUnit[] }) {
  const pathname = usePathname();
  const { label, hasParent, home } = resolve(pathname, units);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Link
        href={home}
        aria-label="Ir a Inicio"
        className="shrink-0 rounded-[var(--radius-sm)] transition-opacity hover:opacity-75 lg:hidden"
      >
        <Logo size="sm" />
      </Link>

      <nav
        aria-label="Ubicación"
        className="hidden min-w-0 items-center gap-1.5 lg:flex"
      >
        {hasParent ? (
          <Link
            href={home}
            className="-ml-1 flex shrink-0 items-center gap-0.5 rounded-[var(--radius-sm)] px-1 py-1 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Inicio
          </Link>
        ) : null}
        <span className="truncate text-[15px] font-bold text-foreground">
          {hasParent ? (
            <span aria-hidden className="mr-1.5 text-border-strong">
              /
            </span>
          ) : null}
          {label}
        </span>
      </nav>
    </div>
  );
}
