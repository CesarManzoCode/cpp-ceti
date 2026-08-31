"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Dumbbell, Home, Lock, Trophy, Users } from "lucide-react";

import { BrickRow } from "@/components/ui/bricks";
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
    { href: "/app/logros", label: "Logros", icon: Trophy },
    { href: "/app/amigos", label: "Amigos", icon: Users },
  ];
}

/**
 * Navegación de escritorio. Arriba las secciones; abajo el curso
 * entero, cada unidad con su hilera de bloques. Desde el margen se ve
 * de un vistazo cuánto se ha construido de cada módulo.
 */
export function SidebarNav({
  courseSlug,
  courseTitle,
  units,
  onNavigate,
  pendingFriendsCount = 0,
}: {
  courseSlug: string | null;
  courseTitle?: string | null;
  units: RoadmapUnit[];
  onNavigate?: () => void;
  pendingFriendsCount?: number;
}) {
  const pathname = usePathname();
  const topLinks = topLinksFor(courseSlug);

  const totalLessons = units.reduce((s, u) => s + u.lessonCount, 0);
  const doneLessons = units.reduce((s, u) => s + u.completedCount, 0);

  return (
    <nav className="flex flex-col gap-8">
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
                  <span
                    className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold tabular-nums text-primary-foreground"
                    aria-label={`${badge} solicitudes pendientes`}
                  >
                    {badge}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>

      {units.length > 0 && courseSlug ? (
        <div className="min-w-0">
          <div className="mb-3 flex items-baseline justify-between gap-3 px-6">
            <h3 className="min-w-0 flex-1 truncate text-[13px] font-bold uppercase tracking-[0.06em] text-subtle-foreground">
              {courseTitle ?? "Tu curso"}
            </h3>
            {totalLessons > 0 ? (
              <span className="text-[13px] font-semibold tabular-nums text-subtle-foreground">
                {doneLessons}/{totalLessons}
              </span>
            ) : null}
          </div>

          <ul className="flex flex-col gap-0.5 px-3">
            {units.map((unit) => {
              const href = `/app/c/${courseSlug}/u/${unit.slug}`;
              const active = pathname.startsWith(href) && unit.published;
              const completed =
                unit.lessonCount > 0 &&
                unit.completedCount === unit.lessonCount;
              const started = unit.completedCount > 0 && !completed;

              const body = (
                <>
                  <span className="flex items-center gap-2.5">
                    <UnitMark
                      completed={completed}
                      locked={!unit.published}
                      started={started}
                      order={unit.order}
                      active={active}
                    />
                    <span className="min-w-0 flex-1 truncate">{unit.title}</span>
                    {unit.published && unit.lessonCount > 0 && !completed ? (
                      <span className="shrink-0 text-[12px] font-semibold tabular-nums text-subtle-foreground">
                        {unit.completedCount}/{unit.lessonCount}
                      </span>
                    ) : null}
                  </span>
                  {unit.published && unit.lessonCount > 0 ? (
                    <BrickRow
                      className="mt-2 ml-[26px]"
                      size="sm"
                      total={unit.lessonCount}
                      done={unit.completedCount}
                      tone={completed ? "success" : "primary"}
                      srLabel={`${unit.completedCount} de ${unit.lessonCount} lecciones`}
                    />
                  ) : null}
                </>
              );

              const rowClass = cn(
                "block rounded-[var(--radius-md)] px-3 py-2.5 text-[14px] transition-colors",
                unit.published
                  ? active
                    ? "bg-accent font-bold text-foreground"
                    : "font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                  : "font-medium text-subtle-foreground",
              );

              return (
                <li key={unit.slug}>
                  {unit.published ? (
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={rowClass}
                    >
                      {body}
                    </Link>
                  ) : (
                    <span
                      aria-disabled
                      title="Próximamente"
                      className={rowClass}
                    >
                      {body}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
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
  started,
  order,
  active,
}: {
  completed: boolean;
  locked: boolean;
  started: boolean;
  order: number;
  active: boolean;
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
        started || active
          ? "bg-primary text-primary-foreground"
          : "bg-surface-2 text-subtle-foreground",
      )}
    >
      {order}
    </span>
  );
}
