import Link from "next/link";
import { Check, Code2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BrickRow } from "@/components/ui/bricks";
import { getPracticeGroups } from "@/features/practice/queries";
import { getCourseBySlug } from "@/features/roadmap/queries";
import { LEGACY_CPP_COURSE_SLUG } from "@/lib/courses";
import { requireSession } from "@/lib/get-session";
import { DIFFICULTY_META } from "@/lib/difficulty";
import { pluralize } from "@/lib/utils";

export const metadata = {
  title: "Práctica",
};

export default async function EjerciciosPage() {
  const session = await requireSession();
  const course = await getCourseBySlug(LEGACY_CPP_COURSE_SLUG);
  const groups = course
    ? await getPracticeGroups(course.id, session.user.id)
    : [];

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
          <div className="mt-6 flex max-w-md items-center gap-4">
            <BrickRow
              className="min-w-0 flex-1"
              total={totalExercises}
              done={totalPassed}
              size="md"
              tone="success"
              srLabel={`${totalPassed} de ${totalExercises} ejercicios resueltos`}
            />
            <span className="shrink-0 text-[14px] font-bold tabular-nums text-muted-foreground">
              {totalPassed}/{totalExercises}
            </span>
          </div>
        ) : null}
      </header>

      {groups.length === 0 ? (
        <div className="mt-10 rounded-[var(--radius-xl)] border border-dashed border-border-strong bg-card px-6 py-12 text-center">
          <h2 className="text-[19px] font-bold">
            Los ejercicios se desbloquean conforme avanzas
          </h2>
          <p className="mx-auto mt-2.5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            Sigue el camino del curso y cada unidad te abrirá nuevos retos para
            consolidar lo aprendido.
          </p>
        </div>
      ) : (
        <>
          <nav aria-label="Ir a una unidad" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {groups.map((group) => {
                const passed = group.exercises.filter((e) => e.passed).length;
                const done = passed === group.exercises.length;
                return (
                  <li key={group.unitSlug}>
                    <a
                      href={`#u-${group.unitSlug}`}
                      className={
                        "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors " +
                        (done
                          ? "border-success/25 bg-success-soft text-success hover:brightness-95"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground")
                      }
                    >
                      <span className="max-w-[18ch] truncate">
                        {group.unitTitle}
                      </span>
                      <span className="tabular-nums opacity-80">
                        {passed}/{group.exercises.length}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-10 flex flex-col gap-10">
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
                          href={`/app/ejercicios/${ex.slug}`}
                          className="group block h-full rounded-[var(--radius-lg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          <article
                            className={
                              "flex h-full items-start gap-3.5 rounded-[var(--radius-lg)] border p-4 shadow-[var(--shadow-xs)] transition-[border-color,box-shadow,transform] duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-[var(--shadow-md)] " +
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
