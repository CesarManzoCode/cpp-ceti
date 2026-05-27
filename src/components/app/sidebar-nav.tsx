"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Circle, Home, Lock, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SidebarUnit {
  slug: string;
  title: string;
  order: number;
  published: boolean;
  lessonCount: number;
  completedCount: number;
}

// Los enlaces principales viven dentro del client component porque
// pasar componentes de Lucide (function components) como prop desde un
// Server Component a un Client Component rompe la serialización RSC.
const topLinks = [
  { href: "/app", label: "Inicio", icon: Home },
  { href: "/app/logros", label: "Logros", icon: Trophy },
];

export function SidebarNav({
  units,
  onNavigate,
}: {
  units: SidebarUnit[];
  /** Hook para que el mobile sidebar cierre al navegar. */
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-7">
      <ul className="flex flex-col gap-0.5">
        {topLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium",
                  "transition-[background-color,color]",
                  active
                    ? "bg-primary-soft text-primary-soft-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <link.icon className="size-4" aria-hidden />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="space-y-2.5">
        <h3 className="px-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
          Unidades
        </h3>
        <ul className="flex flex-col gap-0.5">
          {units.map((unit) => {
            const href = `/app/u/${unit.slug}`;
            const active = pathname.startsWith(href);
            const percent =
              unit.lessonCount === 0
                ? 0
                : Math.round((unit.completedCount / unit.lessonCount) * 100);
            const completed =
              unit.completedCount === unit.lessonCount && unit.lessonCount > 0;

            return (
              <li key={unit.slug}>
                <Link
                  href={unit.published ? href : "#"}
                  onClick={unit.published ? onNavigate : undefined}
                  aria-disabled={!unit.published}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-sm",
                    "transition-[background-color,color]",
                    !unit.published && "cursor-not-allowed opacity-50",
                    active && unit.published
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <UnitStatusIcon
                    completed={completed}
                    locked={!unit.published}
                    percent={percent}
                  />
                  <span className="flex-1 truncate font-medium">
                    <span className="mr-1.5 font-mono text-[11px] text-muted-foreground/70">
                      U{unit.order.toString().padStart(2, "0")}
                    </span>
                    {unit.title}
                  </span>
                  {unit.published && unit.lessonCount > 0 && !completed ? (
                    <span className="font-mono text-[10px] tabular-nums text-muted-foreground/80">
                      {unit.completedCount}/{unit.lessonCount}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/**
 * Indicador compacto: candado (bloqueado), check verde (completo) o
 * mini-anillo de progreso (parcial). Es 16x16 y se alinea con el texto.
 */
function UnitStatusIcon({
  completed,
  locked,
  percent,
}: {
  completed: boolean;
  locked: boolean;
  percent: number;
}) {
  if (locked) {
    return (
      <span className="grid size-4 shrink-0 place-items-center text-muted-foreground/60">
        <Lock className="size-3.5" aria-hidden />
      </span>
    );
  }
  if (completed) {
    return (
      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-success text-success-foreground">
        <Check className="size-2.5" strokeWidth={3} aria-hidden />
      </span>
    );
  }
  if (percent === 0) {
    return (
      <Circle
        className="size-4 shrink-0 text-muted-foreground/40"
        aria-hidden
      />
    );
  }
  // Mini conic-gradient progress ring (no extra SVG cost)
  return (
    <span
      className="grid size-4 shrink-0 place-items-center rounded-full"
      style={{
        background: `conic-gradient(var(--primary) ${percent * 3.6}deg, var(--surface-3) 0)`,
      }}
      aria-hidden
    >
      <span className="size-2.5 rounded-full bg-card" />
    </span>
  );
}
