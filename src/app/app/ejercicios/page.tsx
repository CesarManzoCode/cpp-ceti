import Link from "next/link";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getPracticeGroups } from "@/features/practice/queries";
import { requireSession } from "@/lib/get-session";
import { DIFFICULTY_META } from "@/lib/difficulty";
import { pluralize } from "@/lib/utils";

export const metadata = {
  title: "Ejercicios",
};

export default async function EjerciciosPage() {
  const session = await requireSession();
  const groups = await getPracticeGroups(session.user.id);

  const totalExercises = groups.reduce((acc, g) => acc + g.exercises.length, 0);
  const totalPassed = groups.reduce(
    (acc, g) => acc + g.exercises.filter((e) => e.passed).length,
    0,
  );

  return (
    <div
      data-page-enter
      className="mx-auto max-w-3xl px-5 py-6 sm:px-6 lg:px-8 lg:py-9"
    >
      <header className="border-b border-border pb-6">
        <p className="label-micro text-muted-foreground">Práctica abierta</p>
        <h1 className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-[-0.028em] sm:text-[34px]">
          Ejercicios
        </h1>
        <p className="mt-3 max-w-[54ch] text-[15px] leading-relaxed text-muted-foreground">
          Retos sueltos por unidad. Úsalos para consolidar lo que viste en una
          lección o para retarte si te atoraste.
        </p>

        {totalExercises > 0 ? (
          <p className="mt-4 font-mono text-[13px] tabular-nums text-muted-foreground">
            <span className="text-foreground">
              {totalPassed}/{totalExercises}
            </span>{" "}
            {pluralize(
              totalExercises,
              "ejercicio resuelto",
              "ejercicios resueltos",
            )}
          </p>
        ) : null}
      </header>

      {groups.length === 0 ? (
        <div className="mt-8 border border-dashed border-border px-6 py-10 text-center">
          <h2 className="text-base font-semibold">
            Los ejercicios se desbloquean conforme avanzas
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Sigue el camino del curso y cada unidad te abrirá nuevos retos para
            consolidar lo aprendido.
          </p>
        </div>
      ) : (
        <>
          {/* Índice de unidades: con ~80 retos, saltar a la unidad que estás
              cursando es la acción más frecuente de esta pantalla. */}
          <nav aria-label="Ir a una unidad" className="mt-6">
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {groups.map((group, i) => (
                <li key={group.unitSlug}>
                  <a
                    href={`#u-${group.unitSlug}`}
                    className="flex items-baseline gap-1.5 font-mono text-[11px] text-muted-foreground underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] hover:text-foreground hover:decoration-border-strong"
                  >
                    <span className="tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="max-w-[16ch] truncate font-sans">
                      {group.unitTitle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 space-y-9">
            {groups.map((group, gi) => {
              const passed = group.exercises.filter((e) => e.passed).length;
              return (
                <section key={group.unitSlug} id={`u-${group.unitSlug}`}>
                  <div className="flex items-center gap-4">
                    <h2 className="flex shrink-0 items-baseline gap-2.5 text-[15px] font-semibold">
                      <span className="font-mono text-[13px] tabular-nums text-muted-foreground">
                        {String(gi + 1).padStart(2, "0")}
                      </span>
                      {group.unitTitle}
                    </h2>
                    <span aria-hidden className="h-px min-w-4 flex-1 bg-border" />
                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                      {passed}/{group.exercises.length}
                    </span>
                  </div>

                  <ol className="gutter-list mt-3 border-y border-border">
                    {group.exercises.map((ex, idx) => (
                      <li
                        key={ex.id}
                        className="border-t border-border first:border-t-0"
                      >
                        <Link
                          href={`/app/ejercicios/${ex.slug}`}
                          className="gutter-row items-center transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                        >
                          <span className="flex items-center justify-center pr-3">
                            {ex.passed ? (
                              <span
                                aria-hidden
                                className="grid size-4 place-items-center rounded-[1px] bg-success text-success-foreground"
                                title="Resuelto"
                              >
                                <Check className="size-3" strokeWidth={3} />
                              </span>
                            ) : (
                              <span
                                aria-hidden
                                className="font-mono text-[12px] tabular-nums text-muted-foreground/70"
                              >
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                            )}
                          </span>

                          <span className="flex min-w-0 items-center gap-4 py-3 pl-4">
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[14px] font-medium text-foreground">
                                {ex.title}
                              </span>
                              <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">
                                {ex.description}
                              </span>
                            </span>

                            <span className="flex shrink-0 items-center gap-2.5">
                              {ex.attempts > 0 && !ex.passed ? (
                                <span className="hidden font-mono text-[11px] tabular-nums text-muted-foreground sm:inline">
                                  {ex.attempts}{" "}
                                  {pluralize(ex.attempts, "intento", "intentos")}
                                </span>
                              ) : null}
                              <Badge
                                variant={DIFFICULTY_META[ex.difficulty].variant}
                                size="sm"
                              >
                                {DIFFICULTY_META[ex.difficulty].label}
                              </Badge>
                              <span className="w-12 shrink-0 text-right font-mono text-[11px] tabular-nums text-warning">
                                +{ex.xpReward} XP
                              </span>
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}
          </div>

          <p className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-5 text-xs text-muted-foreground">
            <span className="label-micro">Dificultad</span>
            <span className="inline-flex items-center gap-1.5">
              <Badge variant="success" size="sm">
                Fácil
              </Badge>
              pocas piezas por completar
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Badge variant="info" size="sm">
                Intermedio
              </Badge>
              medio camino hecho
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Badge variant="warning" size="sm">
                Difícil
              </Badge>
              casi todo desde cero
            </span>
          </p>
        </>
      )}
    </div>
  );
}
