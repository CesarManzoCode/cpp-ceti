import Link from "next/link";
import type { CSSProperties } from "react";
import { ChevronLeft, CheckCircle2, Sparkles, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConsoleEyebrow } from "@/components/ui/console-eyebrow";
import { getPracticeGroups } from "@/lib/practice";
import { requireSession } from "@/lib/get-session";
import { cn, pluralize } from "@/lib/utils";

export const metadata = {
  title: "Ejercicios",
};

const difficultyMeta = {
  easy: { label: "Fácil", variant: "success" as const },
  medium: { label: "Intermedio", variant: "info" as const },
  hard: { label: "Difícil", variant: "warning" as const },
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
      className="mx-auto max-w-5xl space-y-10 px-5 py-8 sm:px-6 lg:px-8 lg:py-10"
    >
      <Button asChild size="sm" variant="ghost" className="-ml-2.5 self-start">
        <Link href="/app">
          <ChevronLeft />
          Inicio
        </Link>
      </Button>

      <header className="space-y-3">
        <ConsoleEyebrow tone="primary">Ejercicios</ConsoleEyebrow>
        <h1 className="text-balance text-3xl font-bold tracking-[-0.025em] sm:text-[40px]">
          Práctica abierta
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Retos sueltos por unidad. Úsalos para consolidar lo que viste en una
          lección o para retarte si te atoraste. La dificultad es{" "}
          <strong className="text-foreground">relativa a la unidad</strong>:
          fácil = pocas piezas que completar, difícil = casi todo desde cero.
        </p>
        {totalExercises > 0 ? (
          <p className="text-sm text-muted-foreground">
            Llevas{" "}
            <span className="font-semibold text-foreground tabular-nums">
              {totalPassed}/{totalExercises}
            </span>{" "}
            {pluralize(totalExercises, "ejercicio resuelto", "ejercicios resueltos")}.
          </p>
        ) : null}
      </header>

      {groups.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-border p-10 text-center">
          <Sparkles className="mx-auto size-8 text-muted-foreground/60" aria-hidden />
          <p className="mt-4 text-sm text-muted-foreground">
            Aún no hay ejercicios cargados. Vuelve pronto — estamos llenando
            unidad por unidad.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {groups.map((group) => {
            const passed = group.exercises.filter((e) => e.passed).length;
            return (
              <section key={group.unitSlug} className="space-y-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="flex items-baseline gap-3 text-lg font-semibold tracking-tight">
                    {group.unitIcon ? (
                      <span className="text-xl" aria-hidden>
                        {group.unitIcon}
                      </span>
                    ) : null}
                    <span>{group.unitTitle}</span>
                  </h2>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {passed}/{group.exercises.length}
                  </span>
                </div>

                <div
                  data-stagger
                  style={{ "--stagger": "30ms" } as CSSProperties}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {group.exercises.map((ex, idx) => (
                    <Link
                      key={ex.id}
                      href={`/app/ejercicios/${ex.slug}`}
                      style={{ "--i": idx } as CSSProperties}
                      className={cn(
                        "group flex flex-col gap-3 rounded-[var(--radius-lg)] border bg-card p-5 transition-colors animate-fade-up",
                        ex.passed
                          ? "border-success/30 hover:border-success/50"
                          : "border-border hover:border-border-strong",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[15px] font-semibold tracking-tight">
                          {ex.title}
                        </h3>
                        {ex.passed ? (
                          <CheckCircle2
                            className="size-5 shrink-0 text-success"
                            aria-hidden
                          />
                        ) : null}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {ex.description}
                      </p>
                      <div className="mt-auto flex items-center gap-2 pt-2">
                        <Badge
                          variant={difficultyMeta[ex.difficulty].variant}
                          size="sm"
                        >
                          {difficultyMeta[ex.difficulty].label}
                        </Badge>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                          <Zap className="size-3 text-warning" aria-hidden />
                          {ex.xpReward} XP
                        </span>
                        {ex.attempts > 0 && !ex.passed ? (
                          <span className="ml-auto text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                            {ex.attempts}{" "}
                            {pluralize(ex.attempts, "intento", "intentos")}
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
