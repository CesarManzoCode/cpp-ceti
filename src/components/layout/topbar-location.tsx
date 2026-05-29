"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import type { RoadmapUnit } from "@/features/roadmap/types";

const STATIC_LABELS: Record<string, string> = {
  "/app": "Inicio",
  "/app/ejercicios": "Ejercicios",
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
  return { label: "Inicio", hasParent: false };
}

/**
 * Persistent wayfinding in the top chrome: a brand mark on mobile (the sidebar
 * logo is hidden there) plus a breadcrumb so every page answers "where am I"
 * and offers a one-tap path back to Inicio.
 */
export function TopbarLocation({ units }: { units: RoadmapUnit[] }) {
  const pathname = usePathname();
  const { label, hasParent } = resolve(pathname, units);

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Link
        href="/app"
        aria-label="Ir a Inicio"
        className="shrink-0 rounded-[var(--radius-sm)] transition-opacity hover:opacity-80 md:hidden"
      >
        <Logo glyphOnly />
      </Link>

      <nav
        aria-label="Ubicación"
        className="flex min-w-0 items-center gap-1.5 text-sm"
      >
        {hasParent ? (
          <>
            <Link
              href="/app"
              className="hidden shrink-0 text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              Inicio
            </Link>
            <ChevronRight
              className="hidden size-3.5 shrink-0 text-muted-foreground/40 sm:block"
              aria-hidden
            />
          </>
        ) : null}
        <span className="truncate font-semibold tracking-tight text-foreground">
          {label}
        </span>
      </nav>
    </div>
  );
}
