import Link from "next/link";
import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import type { RoadmapUnit } from "@/features/roadmap/types";

export interface RoadmapUnitsProps {
  courseSlug: string;
  units: RoadmapUnit[];
}

/**
 * El temario como archivo fuente: canaleta con el ordinal y el estado a
 * la izquierda del filete, contenido a la derecha. Es una lista, no una
 * cuadrícula de tarjetas, porque las unidades son comparables y se leen
 * en orden — el ojo baja por la columna de números.
 */
export function RoadmapUnits({ courseSlug, units }: RoadmapUnitsProps) {
  void courseSlug;

  if (units.length === 0) {
    return (
      <p className="border border-dashed border-border px-5 py-8 text-center text-sm text-muted-foreground">
        Aún no hay unidades publicadas en el curso.
      </p>
    );
  }

  const headIndex = findHeadIndex(units);

  return (
    <ol className="gutter-list border-y border-border">
      {units.map((unit, idx) => {
        const completed =
          unit.lessonCount > 0 && unit.completedCount === unit.lessonCount;
        const inProgress =
          !completed && unit.completedCount > 0 && unit.published;
        const isNext = idx === headIndex && unit.published && !inProgress;
        const percent =
          unit.lessonCount === 0
            ? 0
            : Math.round((unit.completedCount / unit.lessonCount) * 100);

        const status = completed
          ? { text: "Completada", tone: "text-success" }
          : inProgress
            ? { text: "En curso", tone: "text-primary" }
            : isNext
              ? { text: "Siguiente", tone: "text-primary" }
              : !unit.published
                ? { text: "Próximamente", tone: "text-muted-foreground/70" }
                : null;

        const body = (
          <>
            <span className="flex items-start justify-center pr-3 pt-4">
              <UnitMark
                order={unit.order}
                completed={completed}
                inProgress={inProgress}
                locked={!unit.published}
              />
            </span>

            <span className="min-w-0 py-4 pl-4">
              <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="label-micro text-muted-foreground">
                  Unidad {String(unit.order).padStart(2, "0")}
                </span>
                {status ? (
                  <span className={cn("label-micro", status.tone)}>
                    {status.text}
                  </span>
                ) : null}
              </span>

              <span
                className={cn(
                  "mt-1.5 block text-[16px] font-semibold leading-snug sm:text-[17px]",
                  unit.published ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {unit.title}
              </span>

              {unit.published && unit.lessonCount > 0 ? (
                <span className="mt-2.5 flex max-w-[220px] items-center gap-3">
                  <span
                    aria-hidden
                    className="h-[3px] flex-1 overflow-hidden bg-surface-3"
                  >
                    <span
                      className={cn(
                        "block h-full transition-[width] duration-500",
                        completed ? "bg-success" : "bg-primary",
                      )}
                      style={{ width: `${percent}%` }}
                    />
                  </span>
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                    {unit.completedCount}/{unit.lessonCount}
                  </span>
                </span>
              ) : null}
            </span>
          </>
        );

        return (
          <li key={unit.slug} className="border-t border-border first:border-t-0">
            {unit.published ? (
              <Link
                href={`/app/u/${unit.slug}`}
                aria-label={`Unidad ${unit.order}: ${unit.title}`}
                className="gutter-row transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
              >
                {body}
              </Link>
            ) : (
              <div className="gutter-row opacity-70">{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function findHeadIndex(units: RoadmapUnit[]): number {
  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    const completed = u.lessonCount > 0 && u.completedCount === u.lessonCount;
    if (!completed && u.published) {
      return i;
    }
  }
  return -1;
}

/**
 * Marca de estado en la canaleta. La forma lleva la información: cuadro
 * lleno = terminada, cuadro con núcleo = en curso, ordinal = pendiente,
 * candado = sin publicar. El color sólo lo refuerza.
 */
function UnitMark({
  order,
  completed,
  inProgress,
  locked,
}: {
  order: number;
  completed: boolean;
  inProgress: boolean;
  locked: boolean;
}) {
  if (locked) {
    return <Lock className="size-3.5 text-muted-foreground/50" aria-hidden />;
  }
  if (completed) {
    return <span aria-hidden className="size-3 rounded-[1px] bg-success" />;
  }
  if (inProgress) {
    return (
      <span
        aria-hidden
        className="grid size-3 place-items-center rounded-[1px] border border-primary"
      >
        <span className="size-1.5 bg-primary" />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className="font-mono text-[12px] tabular-nums text-muted-foreground/70"
    >
      {String(order).padStart(2, "0")}
    </span>
  );
}
