import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronDown, Code2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ProgressSequence } from "@/components/ui/bricks";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getPracticeGroups } from "@/features/practice/queries";
import { getCourseBySlug } from "@/features/roadmap/queries";
import { requireSession } from "@/lib/get-session";
import { DIFFICULTY_META } from "@/lib/difficulty";
import { cn, pluralize } from "@/lib/utils";

export const metadata = {
  title: "Práctica",
};

interface PageProps {
  params: Promise<{ courseSlug: string }>;
}

export default async function EjerciciosPage({ params }: PageProps) {
  const { courseSlug } = await params;
  const session = await requireSession();

  const course = await getCourseBySlug(courseSlug);
  if (!course) notFound();

  const groups = await getPracticeGroups(course.id, session.user.id);

  const totalExercises = groups.reduce((acc, g) => acc + g.exercises.length, 0);
  const totalPassed = groups.reduce(
    (acc, g) => acc + g.exercises.filter((e) => e.passed).length,
    0,
  );

  return (
    <div
      data-page-enter
      className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10"
    >
      <header>
        <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.034em] sm:text-[38px]">
          Práctica
        </h1>
        <p className="mt-3 max-w-[58ch] text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
          Retos sueltos organizados por unidad. Úsalos para consolidar lo que
          viste en una lección o para retarte si te atoraste.
        </p>

        {totalExercises > 0 ? (
          <div className="mt-6 max-w-md">
            <ProgressSequence
              total={totalExercises}
              done={totalPassed}
              label="ejercicios"
              tone="success"
            />
          </div>
        ) : null}
      </header>

      {groups.length === 0 ? (
        <div className="mt-10">
          <h2 className="text-[19px] font-bold">
            Los ejercicios se desbloquean conforme avanzas
          </h2>
          <p className="mt-2.5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            Sigue el camino del curso y cada unidad te abrirá nuevos retos para
            consolidar lo aprendido.
          </p>
        </div>
      ) : (
        <>
        <div className="mt-8 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-8">
          {/* Selector de unidad (blueprint UX/UI, H12): lista vertical
              compacta en escritorio, sheet accesible en móvil/tablet —
              nunca la nube de píldoras que hacía competir 10 unidades
              como si fueran etiquetas. */}
          <div className="lg:sticky lg:top-24">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border-strong bg-card px-4 text-[14px] font-semibold text-foreground",
                    "h-11 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  )}
                >
                  Ir a una unidad
                  <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[80svh] overflow-y-auto rounded-t-[var(--radius-lg)] p-4">
                  <SheetHeader className="px-0 pb-2 pt-0 text-left">
                    <SheetTitle>Ir a una unidad</SheetTitle>
                  </SheetHeader>
                  <UnitSelectorList groups={groups} />
                </SheetContent>
              </Sheet>
            </div>

            <nav
              aria-label="Ir a una unidad"
              className="hidden lg:block"
            >
              <UnitSelectorList groups={groups} />
            </nav>
          </div>

          <div className="mt-8 flex flex-col gap-10 lg:mt-0">
            {groups.map((group) => {
              const passed = group.exercises.filter((e) => e.passed).length;
              return (
                <section key={group.unitSlug} id={`u-${group.unitSlug}`} className="scroll-mt-24">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-[19px] font-bold tracking-[-0.02em]">
                      {group.unitTitle}
                    </h2>
                    <span className="shrink-0 text-[13px] font-semibold tabular-nums text-muted-foreground">
                      {passed}/{group.exercises.length} resueltos
                    </span>
                  </div>

                  <ul className="mt-4 grid gap-3 md:grid-cols-2">
                    {group.exercises.map((ex) => (
                      <li key={ex.id}>
                        <Link
                          href={`/app/c/${course.slug}/ejercicios/${ex.slug}`}
                          className="group block h-full rounded-[var(--radius-lg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          <article
                            className={
                              "flex h-full items-start gap-3.5 rounded-[var(--radius-lg)] border p-4 transition-[border-color,box-shadow,transform] duration-200 group-hover:border-primary/40 " +
                              (ex.passed
                                ? "border-success/25 bg-success-soft/35"
                                : "border-border bg-card")
                            }
                          >
                            <span
                              aria-hidden
                              className={
                                "mt-0.5 grid size-8 shrink-0 place-items-center rounded-[var(--radius-sm)] " +
                                (ex.passed
                                  ? "bg-success text-success-foreground"
                                  : "bg-surface-2 text-subtle-foreground")
                              }
                            >
                              {ex.passed ? (
                                <Check className="size-[18px]" strokeWidth={3.2} />
                              ) : (
                                <Code2 className="size-4" />
                              )}
                            </span>

                            <div className="min-w-0 flex-1">
                              <h3 className="text-[16px] font-bold leading-snug">
                                {ex.title}
                              </h3>
                              <p className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-muted-foreground">
                                {ex.description}
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                                <Badge
                                  variant={DIFFICULTY_META[ex.difficulty].variant}
                                  size="sm"
                                >
                                  {DIFFICULTY_META[ex.difficulty].label}
                                </Badge>
                                <span className="text-[13px] font-bold text-warning">
                                  +{ex.xpReward} XP
                                </span>
                                {ex.attempts > 0 && !ex.passed ? (
                                  <span className="text-[13px] font-medium text-subtle-foreground">
                                    {ex.attempts}{" "}
                                    {pluralize(ex.attempts, "intento", "intentos")}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </article>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>

          <div className="mt-12 rounded-[var(--radius-lg)] border border-border bg-surface-2 p-5">
            <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-subtle-foreground">
              Cómo leer la dificultad
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2.5 text-[14px] text-muted-foreground">
              <li className="inline-flex items-center gap-2">
                <Badge variant="success" size="sm">
                  Fácil
                </Badge>
                pocas piezas por completar
              </li>
              <li className="inline-flex items-center gap-2">
                <Badge variant="info" size="sm">
                  Intermedio
                </Badge>
                medio camino hecho
              </li>
              <li className="inline-flex items-center gap-2">
                <Badge variant="warning" size="sm">
                  Difícil
                </Badge>
                casi todo desde cero
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Lista de unidades reutilizada por el rail de escritorio y el sheet de
 * móvil: título, estado y cuenta — nunca una etiqueta truncada entre
 * otras diez compitiendo por el mismo ancho.
 */
function UnitSelectorList({
  groups,
}: {
  groups: Awaited<ReturnType<typeof getPracticeGroups>>;
}) {
  return (
    <ul className="flex flex-col gap-0.5">
      {groups.map((group) => {
        const passed = group.exercises.filter((e) => e.passed).length;
        const done = passed === group.exercises.length;
        return (
          <li key={group.unitSlug}>
            <a
              href={`#u-${group.unitSlug}`}
              className={cn(
                "flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2.5 text-[14px] font-semibold transition-colors",
                done
                  ? "text-success hover:bg-success-soft"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <span className="min-w-0 flex-1 truncate">{group.unitTitle}</span>
              <span className="shrink-0 text-[12.5px] font-bold tabular-nums opacity-80">
                {passed}/{group.exercises.length}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
