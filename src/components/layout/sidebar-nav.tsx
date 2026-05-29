"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Circle, Dumbbell, Home, Lock, Trophy } from "lucide-react";

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
  { href: "/app/logros", label: "Logros", icon: Trophy },
];

export function SidebarNav({
  units,
  onNavigate,
}: {
  units: RoadmapUnit[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-7">
      <NavGroup activeKey={pathname}>
        {topLinks.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <NavItem
              key={link.href}
              href={link.href}
              active={active}
              onNavigate={onNavigate}
            >
              <link.icon className="size-4 shrink-0" aria-hidden />
              <span>{link.label}</span>
            </NavItem>
          );
        })}
      </NavGroup>

      <div className="space-y-3">
        <h3 className="eyebrow px-3 text-muted-foreground/80">Unidades</h3>
        <NavGroup activeKey={pathname}>
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
                <span className="flex-1 min-w-0 truncate font-medium">
                  {unit.title}
                </span>
                {unit.published && unit.lessonCount > 0 && !completed ? (
                  <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/80">
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
 * Grupo con indicador activo deslizante a la izquierda.
 * El indicador se mueve animado al item activo (firma visual premium).
 */
function NavGroup({
  children,
  activeKey,
}: {
  children: React.ReactNode;
  /** Re-measure the indicator whenever the active route changes. */
  activeKey?: string;
}) {
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
        setIndicator((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        return;
      }
      const groupRect = group.getBoundingClientRect();
      const itemRect = active.getBoundingClientRect();
      const next = {
        top: itemRect.top - groupRect.top,
        height: itemRect.height,
        visible: true,
      };
      setIndicator((prev) =>
        prev.top === next.top &&
        prev.height === next.height &&
        prev.visible === next.visible
          ? prev
          : next,
      );
    };

    // Measure after the DOM commits the new data-active attribute.
    const raf = requestAnimationFrame(update);
    const ro = new ResizeObserver(update);
    ro.observe(group);
    Array.from(group.children).forEach((child) => ro.observe(child));
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [activeKey]);

  return (
    <ul ref={groupRef} className="relative flex flex-col gap-0.5">
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
  const itemClass = cn(
    "group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm",
    "transition-[background-color,color] duration-150",
    disabled
      ? "cursor-not-allowed text-muted-foreground/50"
      : active
        ? "bg-accent text-foreground"
        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
  );

  // Locked items are inert: not a link, not in the tab order, no dead "#" jump.
  if (disabled) {
    return (
      <li>
        <span aria-disabled className={itemClass}>
          {children}
        </span>
      </li>
    );
  }

  return (
    <li data-active={active ? "true" : undefined}>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={itemClass}
      >
        {children}
      </Link>
    </li>
  );
}

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
