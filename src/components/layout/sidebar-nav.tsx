"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Check, Dumbbell, Home, Lock, Swords, Users } from "lucide-react";

import { ProgressSequence } from "@/components/ui/bricks";
import { Button } from "@/components/ui/button";
import {
  CourseSwitcher,
  type CourseSwitcherItem,
} from "@/features/courses/components/course-switcher";
import { cn } from "@/lib/utils";
import type { RoadmapUnit } from "@/features/roadmap/types";

/**
 * Enlaces de la barra. Inicio y Práctica pertenecen a UN curso, así que
 * llevan su slug; los demás son de la cuenta y no dependen del curso.
 *
 * Sin curso seleccionado, Inicio apunta a la pantalla de selección y
 * Práctica no se muestra: no existe "la práctica" a secas, existe la de
 * un curso.
 */
function topLinksFor(courseSlug: string | null): {
  href: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
}[] {
  return [
    {
      href: courseSlug ? `/app/c/${courseSlug}` : "/app",
      label: "Inicio",
      icon: Home,
      exact: true,
    },
    ...(courseSlug
      ? [
          {
            href: `/app/c/${courseSlug}/ejercicios`,
            label: "Práctica",
            icon: Dumbbell,
          },
        ]
      : []),
    { href: "/app/liga", label: "Liga", icon: Swords },
    { href: "/app/amigos", label: "Amigos", icon: Users },
  ];
}

/** Primera unidad publicada y no terminada: "estás aquí" en el curso. */
function findCurrentUnitIndex(units: RoadmapUnit[]): number {
  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    const completed = u.lessonCount > 0 && u.completedCount === u.lessonCount;
    if (u.published && !completed) return i;
  }
  return -1;
}

/**
 * Navegación de escritorio. Arriba las secciones de la cuenta; abajo un
 * bloque compacto de "curso actual" — progreso global, la unidad en
 * curso y sus dos vecinas, y un botón al mapa completo.
 *
 * A propósito NO dibuja el índice de las 10-20 unidades del curso: eso
 * duplicaba el mapa vertical de Inicio y convertía el rail en un
 * segundo currículo compitiendo por el mismo ancho (blueprint UX/UI,
 * sección C1 y D2). El mapa completo vive en un solo lugar.
 */
export function SidebarNav({
  courseSlug,
  courses = [],
  units,
  onNavigate,
  pendingFriendsCount = 0,
}: {
  courseSlug: string | null;
  /** Cursos publicados: alimentan el selector de curso actual. */
  courses?: CourseSwitcherItem[];
  units: RoadmapUnit[];
  onNavigate?: () => void;
  pendingFriendsCount?: number;
}) {
  const pathname = usePathname();
  const topLinks = topLinksFor(courseSlug);

  const totalLessons = units.reduce((s, u) => s + u.lessonCount, 0);
  const doneLessons = units.reduce((s, u) => s + u.completedCount, 0);
  const currentIndex = findCurrentUnitIndex(units);
  const neighborhood =
    currentIndex === -1
      ? []
      : units.slice(Math.max(0, currentIndex - 1), currentIndex + 2);

  return (
    <nav className="flex flex-col gap-8">
      {courses.length > 0 ? (
        /* El curso actual es un control, no un rótulo: desde aquí se ve
           cuál está activo y se cambia sin salir de la pantalla. */
        <div className="px-3">
          <CourseSwitcher courses={courses} activeSlug={courseSlug} />
        </div>
      ) : null}

      <ul className="flex flex-col gap-1 px-3">
        {topLinks.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          const badge =
            link.href === "/app/amigos" && pendingFriendsCount > 0
              ? pendingFriendsCount
              : null;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-[15px] font-semibold transition-colors",
                  active
                    ? "bg-primary-soft text-primary-soft-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <link.icon
                  className={cn("size-[18px] shrink-0")}
                  strokeWidth={active ? 2.4 : 2}
                  aria-hidden
                />
                <span className="flex-1">{link.label}</span>
                {badge ? (
                  <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold tabular-nums text-primary-foreground">
                    <span aria-hidden>{badge > 99 ? "99+" : badge}</span>
                    <span className="sr-only">
                      {badge} {badge === 1 ? "solicitud pendiente" : "solicitudes pendientes"}
                    </span>
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>

      {units.length > 0 && courseSlug ? (
        <div className="min-w-0 border-t border-border px-3 pt-6">
          <div className="mb-3 flex items-baseline justify-between gap-3 px-3">
            <h3 className="min-w-0 flex-1 truncate text-[13px] font-bold uppercase tracking-[0.06em] text-subtle-foreground">
              Curso actual
            </h3>
          </div>

          {totalLessons > 0 ? (
            <div className="px-3">
              <ProgressSequence
                total={totalLessons}
                done={doneLessons}
                label="lecciones"
              />
            </div>
          ) : null}

          {neighborhood.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-0.5">
              {neighborhood.map((unit) => {
                const href = `/app/c/${courseSlug}/u/${unit.slug}`;
                const isCurrent = unit.order === units[currentIndex]?.order;
                const completed =
                  unit.lessonCount > 0 && unit.completedCount === unit.lessonCount;

                return (
                  <li key={unit.slug}>
                    {unit.published ? (
                      <Link
                        href={href}
                        onClick={onNavigate}
                        aria-current={isCurrent ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-[13.5px] transition-colors",
                          isCurrent
                            ? "bg-accent font-bold text-foreground"
                            : "font-medium text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      >
                        <UnitMark completed={completed} order={unit.order} current={isCurrent} />
                        <span className="min-w-0 flex-1 truncate">{unit.title}</span>
                      </Link>
                    ) : (
                      <span
                        aria-disabled
                        title="Próximamente"
                        className="flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-[13.5px] font-medium text-subtle-foreground"
                      >
                        <UnitMark completed={false} order={unit.order} current={false} locked />
                        <span className="min-w-0 flex-1 truncate">{unit.title}</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : null}

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-between px-3 text-muted-foreground hover:text-foreground"
          >
            <Link href={`/app/c/${courseSlug}`} onClick={onNavigate}>
              Abrir mapa del curso
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      ) : null}
    </nav>
  );
}

/**
 * Marca de estado de la unidad: palomita = terminada, punto lleno =
 * en curso, número = por empezar, candado = sin publicar.
 */
function UnitMark({
  completed,
  locked,
  order,
  current,
}: {
  completed: boolean;
  locked?: boolean;
  order: number;
  current: boolean;
}) {
  if (locked) {
    return (
      <span
        aria-hidden
        className="grid size-[18px] shrink-0 place-items-center rounded-[var(--radius-xs)] bg-surface-2 text-subtle-foreground"
      >
        <Lock className="size-3" />
      </span>
    );
  }
  if (completed) {
    return (
      <span
        aria-hidden
        title="Unidad completada"
        className="grid size-[18px] shrink-0 place-items-center rounded-[var(--radius-xs)] bg-success text-success-foreground"
      >
        <Check className="size-3" strokeWidth={3.5} />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-[18px] shrink-0 place-items-center rounded-[var(--radius-xs)] text-[11px] font-bold tabular-nums",
        current
          ? "bg-primary text-primary-foreground"
          : "bg-surface-2 text-subtle-foreground",
      )}
    >
      {order}
    </span>
  );
}
