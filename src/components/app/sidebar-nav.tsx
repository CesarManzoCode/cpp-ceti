"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, Circle, Home, Lock, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

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

export function SidebarNav({ units }: { units: SidebarUnit[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6">
      <ul className="flex flex-col gap-1">
        {topLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <link.icon className="size-4" />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="space-y-2">
        <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
            const completed = unit.completedCount === unit.lessonCount && unit.lessonCount > 0;
            const Icon = !unit.published ? Lock : completed ? CheckCircle2 : Circle;

            return (
              <li key={unit.slug}>
                <Link
                  href={unit.published ? href : "#"}
                  aria-disabled={!unit.published}
                  className={cn(
                    "group flex flex-col gap-1 rounded-lg px-3 py-2 transition-colors",
                    !unit.published && "cursor-not-allowed opacity-50",
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        completed && "text-success",
                      )}
                    />
                    <span className="flex-1 truncate text-sm font-medium">
                      {unit.order}. {unit.title}
                    </span>
                  </div>
                  {unit.published && unit.lessonCount > 0 ? (
                    <div className="flex items-center gap-2 pl-6">
                      <Progress value={percent} className="h-1" />
                      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                        {unit.completedCount}/{unit.lessonCount}
                      </span>
                    </div>
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
