"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { selectCourse } from "@/features/courses/actions";

export interface CoursePickerItem {
  slug: string;
  title: string;
  description: string;
  subjectName: string;
  academicContext: string;
  languageLabel: string;
  unitCount: number;
  lessonCount: number;
}

/**
 * Pantalla de selección de curso.
 *
 * Aparece cuando hay más de un curso y el alumno todavía no eligió. Es una
 * decisión explícita a propósito: entrar "al primero de la lista" mandaría
 * a alguien de POO I al curso de C++ sin que se diera cuenta.
 */
export function CoursePicker({ courses }: { courses: CoursePickerItem[] }) {
  const [pending, setPending] = React.useState<string | null>(null);

  return (
    <ul className="mt-8 grid gap-4 md:grid-cols-2">
      {courses.map((course) => (
        <li key={course.slug}>
          <article className="flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-xs)] transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-[var(--shadow-md)]">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary-tint px-2.5 py-1 text-[12px] font-bold text-primary">
                {course.languageLabel}
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-[0.05em] text-subtle-foreground">
                {course.academicContext}
              </span>
            </div>

            <h2 className="mt-3 text-[20px] font-extrabold leading-snug tracking-[-0.02em]">
              {course.title}
            </h2>
            <p className="mt-1 text-[13px] font-semibold text-muted-foreground">
              {course.subjectName}
            </p>
            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted-foreground">
              {course.description}
            </p>

            <p className="mt-4 text-[13px] font-semibold tabular-nums text-subtle-foreground">
              {course.unitCount} unidades · {course.lessonCount} lecciones
            </p>

            <form
              action={async () => {
                setPending(course.slug);
                await selectCourse(course.slug);
              }}
              className="mt-5"
            >
              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={pending === course.slug}
                disabled={pending !== null}
              >
                Entrar
                <ArrowRight />
              </Button>
            </form>
          </article>
        </li>
      ))}
    </ul>
  );
}
