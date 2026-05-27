"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Check, Circle, Home, Lock, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";
import { LoadingLink } from "@/components/ui/loading-link";

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
      <NavGroup>
        {topLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <NavItem
              key={link.href}
              href={link.href}
              active={active}
              onNavigate={onNavigate}
            >
              <link.icon className="size-4" aria-hidden />
              {link.label}
            </NavItem>
          );
        })}
      </NavGroup>

      <div className="space-y-2.5">
        <h3 className="px-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
          Unidades
        </h3>
        <NavGroup>
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
              <NavItem
                key={unit.slug}
                href={unit.published ? href : "#"}
                active={active && unit.published}
                disabled={!unit.published}
                onNavigate={unit.published ? onNavigate : undefined}
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
              </NavItem>
            );
          })}
        </NavGroup>
      </div>
    </nav>
  );
}

/**
 * Contenedor de items de navegación. La magia visual: medimos la
 * posición del item activo (data-active) y movemos un indicador absoluto
 * de fondo (la "pill" activa) y una barra lateral. Esto produce el
 * efecto signature de Linear/Notion donde el highlight "se desliza"
 * entre items en vez de aparecer/desaparecer.
 */
function NavGroup({ children }: { children: React.ReactNode }) {
  const groupRef = React.useRef<HTMLUListElement | null>(null);
  const [indicator, setIndicator] = React.useState<{
    top: number;
    height: number;
    visible: boolean;
  }>({ top: 0, height: 0, visible: false });

  React.useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const update = () => {
      const active = group.querySelector<HTMLElement>("[data-active='true']");
      if (!active) {
        setIndicator((prev) => ({ ...prev, visible: false }));
        return;
      }
      const groupRect = group.getBoundingClientRect();
      const itemRect = active.getBoundingClientRect();
      setIndicator({
        top: itemRect.top - groupRect.top,
        height: itemRect.height,
        visible: true,
      });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(group);
    // Observe children too (in case items shift)
    Array.from(group.children).forEach((child) => ro.observe(child));
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  });

  return (
    <ul
      ref={groupRef}
      className="relative flex flex-col gap-0.5"
    >
      {/* Indicador lateral deslizante */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 w-[3px] rounded-r-full bg-primary",
          "transition-[transform,height,opacity] duration-[280ms] ease-[var(--ease-spring)]",
        )}
        style={{
          transform: `translateY(${indicator.top}px)`,
          height: indicator.height,
          opacity: indicator.visible ? 1 : 0,
        }}
      />
      {children}
    </ul>
  );
}

function NavItem({
  href,
  active,
  disabled,
  onNavigate,
  children,
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  return (
    <li data-active={active ? "true" : undefined}>
      <LoadingLink
        href={href}
        onClick={onNavigate}
        aria-disabled={disabled}
        aria-current={active ? "page" : undefined}
        showHint={false}
        className={cn(
          "group flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-sm",
          "transition-[background-color,color] duration-150",
          disabled && "cursor-not-allowed opacity-50",
          active
            ? "bg-accent text-foreground"
            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
        )}
      >
        {children}
      </LoadingLink>
    </li>
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
