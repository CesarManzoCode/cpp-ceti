"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Home, Lock, Trophy, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import type { RoadmapUnit } from "@/features/roadmap/types";

const topLinks: {
  href: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
}[] = [
  { href: "/app", label: "Inicio", icon: Home, exact: true },
  { href: "/app/ejercicios", label: "Ejercicios", icon: Dumbbell },
  { href: "/app/amigos", label: "Amigos", icon: Users },
  { href: "/app/logros", label: "Logros", icon: Trophy },
];

/**
 * Índice del cuaderno. Arriba las secciones de la app; abajo el temario
 * como una lista numerada con canaleta, igual que el resto del producto:
 * el ordinal y el estado viven a la izquierda del filete, el título a la
 * derecha. La unidad activa se marca con una barra en la canaleta, no con
 * una píldora de color.
 */
export function SidebarNav({
  units,
  onNavigate,
  pendingFriendsCount = 0,
}: {
  units: RoadmapUnit[];
  onNavigate?: () => void;
  pendingFriendsCount?: number;
}) {
  const pathname = usePathname();

  const totalLessons = units.reduce((s, u) => s + u.lessonCount, 0);
  const doneLessons = units.reduce((s, u) => s + u.completedCount, 0);

  return (
    <nav className="flex flex-col gap-7">
      <ul className="flex flex-col">
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
                  "relative flex items-center gap-3 py-2 pl-4 pr-3 text-sm transition-colors",
                  active
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active ? (
                  <span
                    aria-hidden
                    className="absolute inset-y-1 left-0 w-0.5 bg-primary"
                  />
                ) : null}
                <link.icon
                  className={cn(
                    "size-4 shrink-0",
                    active ? "text-primary" : "text-muted-foreground/70",
                  )}
                  aria-hidden
                />
                <span className="flex-1">{link.label}</span>
                {badge ? (
                  <span
                    className="grid h-4 min-w-4 shrink-0 place-items-center rounded-[var(--radius-xs)] bg-primary px-1 font-mono text-[10px] font-medium tabular-nums text-primary-foreground"
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

      {units.length > 0 ? (
        <div>
          <div className="mb-2 flex items-baseline gap-3 pl-4 pr-3">
            <h3 className="label-micro text-muted-foreground">Temario</h3>
            <span aria-hidden className="h-px flex-1 bg-border" />
            {totalLessons > 0 ? (
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {doneLessons}/{totalLessons}
              </span>
            ) : null}
          </div>

          <ul className="gutter-list" style={{ ["--gutter-w" as string]: "2.5rem" }}>
            {units.map((unit) => {
              const href = `/app/u/${unit.slug}`;
              const active = pathname.startsWith(href) && unit.published;
              const completed =
                unit.lessonCount > 0 &&
                unit.completedCount === unit.lessonCount;

              const body = (
                <>
                  <span className="relative flex items-center justify-center pr-3">
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute inset-y-0.5 left-0 w-0.5 bg-primary"
                      />
                    ) : null}
                    <UnitMark
                      completed={completed}
                      locked={!unit.published}
                      started={unit.completedCount > 0}
                      order={unit.order}
                      active={active}
                    />
                  </span>
                  <span className="flex min-w-0 items-center gap-2 pl-3">
                    <span className="min-w-0 flex-1 truncate">{unit.title}</span>
                    {unit.published && unit.lessonCount > 0 && !completed ? (
                      <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/80">
                        {unit.completedCount}/{unit.lessonCount}
                      </span>
                    ) : null}
                  </span>
                </>
              );

              const rowClass = cn(
                "gutter-row items-center py-1.5 text-[13px] transition-colors",
                unit.published
                  ? active
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  : "text-muted-foreground/55",
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
 * Marca de estado en la canaleta: cuadro lleno = terminada, cuadro con
 * núcleo = empezada, ordinal tenue = sin empezar, candado = por publicar.
 * La forma distingue los estados aunque no se vea el color.
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
    return <Lock className="size-3 text-muted-foreground/50" aria-hidden />;
  }
  if (completed) {
    return (
      <span
        aria-hidden
        className="size-2.5 rounded-[1px] bg-success"
        title="Unidad completada"
      />
    );
  }
  if (started) {
    return (
      <span
        aria-hidden
        className="grid size-2.5 place-items-center rounded-[1px] border border-primary"
      >
        <span className="size-1 bg-primary" />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "font-mono text-[11px] tabular-nums",
        active ? "text-primary" : "text-muted-foreground/60",
      )}
    >
      {String(order).padStart(2, "0")}
    </span>
  );
}
