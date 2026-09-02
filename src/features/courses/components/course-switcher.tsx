"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Check, ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface CourseSwitcherItem {
  slug: string;
  title: string;
  languageLabel: string;
  /** `null` si el curso no declara `curriculum`. */
  curriculumSummary: string | null;
}

/**
 * Subtítulo de cada curso en el menú: `lenguaje · curriculumSummary`
 * cuando el curso declara `curriculum`; si no, sólo el lenguaje (más "·
 * curso actual" si aplica) — el comportamiento de siempre. Exportada
 * aparte porque el contenido del menú (Radix) no se monta cerrado, así
 * que esto es lo único de esta pieza comprobable sin abrir el menú.
 */
export function courseSwitcherSubtitle(
  course: Pick<CourseSwitcherItem, "languageLabel" | "curriculumSummary">,
  isActive: boolean,
): string {
  return (
    course.languageLabel +
    (course.curriculumSummary ? ` · ${course.curriculumSummary}` : "") +
    (isActive ? " · curso actual" : "")
  );
}

/**
 * Control de "curso actual".
 *
 * El curso deja de ser una decisión escondida en una cookie: aquí se ve
 * cuál está activo y se cambia desde cualquier ruta autenticada. Se usa en
 * el rail de escritorio y en la barra superior de móvil, para que ningún
 * breakpoint quede sin salida.
 *
 * Cambiar de curso es sólo navegar a su ruta: el middleware sincroniza la
 * cookie con el curso de la URL en la MISMA respuesta, así que Inicio,
 * Práctica, unidades y avance cambian juntos.
 *
 * Los títulos NO se truncan dentro del menú: el rail puede recortar, pero
 * la identidad completa del curso tiene que poder leerse en algún lugar.
 */
export function CourseSwitcher({
  courses,
  activeSlug,
  variant = "rail",
  className,
}: {
  courses: CourseSwitcherItem[];
  activeSlug: string | null;
  variant?: "rail" | "compact";
  className?: string;
}) {
  const active = courses.find((c) => c.slug === activeSlug) ?? null;
  const label = active?.title ?? "Elegir curso";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title={active ? active.title : undefined}
          aria-label={
            active
              ? `Curso actual: ${active.title}. Cambiar curso`
              : "Elegir curso"
          }
          className={cn(
            "flex min-w-0 gap-2 rounded-[var(--radius-md)] text-left transition-colors",
            variant === "rail"
              ? // Sin truncar a una línea: "PROGRAMACIÓN ORIENTAD…" no le dice
                // nada al alumno. Dos líneas alcanzan para cualquier título
                // de curso actual sin desbordar el rail.
                "w-full items-start px-2 py-1.5 text-[13px] font-bold uppercase tracking-[0.06em] text-subtle-foreground hover:bg-accent hover:text-foreground"
              : // min-w: el título se recorta, pero el control nunca se
                // encoge por debajo de sus dos iconos (se salían de la caja).
                "min-w-[3.25rem] max-w-[52vw] items-center border border-border bg-card px-2.5 py-1.5 text-[13px] font-bold text-foreground hover:bg-accent",
            className,
          )}
        >
          {variant === "compact" ? (
            <BookOpen
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
          ) : null}
          <span
            className={cn(
              "min-w-0 flex-1",
              variant === "rail"
                ? "line-clamp-2 whitespace-normal leading-snug"
                : "truncate",
            )}
          >
            {label}
          </span>
          <ChevronsUpDown
            className={cn(
              "size-3.5 shrink-0 opacity-70",
              variant === "rail" ? "mt-0.5" : null,
            )}
            aria-hidden
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[272px] max-w-[92vw]">
        <DropdownMenuLabel>Cambiar curso</DropdownMenuLabel>
        {courses.map((course) => {
          const isActive = course.slug === activeSlug;
          return (
            <DropdownMenuItem key={course.slug} asChild className="items-start gap-2">
              <Link
                href={`/app/c/${course.slug}`}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="mt-0.5 size-4 shrink-0">
                  {isActive ? <Check className="size-4" aria-hidden /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  {/* Sin truncado: un título largo se lee completo aquí. */}
                  <span className="block whitespace-normal text-[14px] font-semibold leading-snug">
                    {course.title}
                  </span>
                  <span className="block text-[12px] font-medium text-muted-foreground">
                    {courseSwitcherSubtitle(course, isActive)}
                  </span>
                </span>
              </Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/app/cursos">Ver tus cursos y tu avance</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
