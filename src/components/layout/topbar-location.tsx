"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import type { RoadmapUnit } from "@/features/roadmap/types";

const STATIC_LABELS: Record<string, string> = {
  "/app": "Inicio",
  "/app/ejercicios": "Práctica",
  "/app/amigos": "Amigos",
  "/app/logros": "Logros",
  "/app/perfil": "Perfil",
};

function resolve(
  pathname: string,
  units: RoadmapUnit[],
): { label: string; hasParent: boolean } {
  const exact = STATIC_LABELS[pathname];
  if (exact) return { label: exact, hasParent: pathname !== "/app" };

  const seg = pathname.split("/").filter(Boolean);
  if (seg[1] === "u" && seg[2]) {
    const unit = units.find((u) => u.slug === seg[2]);
    return { label: unit?.title ?? "Unidad", hasParent: true };
  }
  if (seg[1] === "ejercicios" && seg[2]) {
    return { label: "Ejercicio", hasParent: true };
  }
  if (seg[1] === "perfil" && seg[2]) {
    return { label: `@${seg[2]}`, hasParent: true };
  }
  return { label: "Inicio", hasParent: false };
}

/**
 * Dónde estoy. En móvil manda la marca (no hay rail que la muestre) y
 * en escritorio, el nombre de la pantalla con retorno a Inicio.
 */
export function TopbarLocation({ units }: { units: RoadmapUnit[] }) {
  const pathname = usePathname();
  const { label, hasParent } = resolve(pathname, units);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Link
        href="/app"
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
            href="/app"
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
