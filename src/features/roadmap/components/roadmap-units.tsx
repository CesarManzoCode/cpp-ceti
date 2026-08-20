import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";

import { BrickColumn } from "@/components/ui/bricks";
import { cn } from "@/lib/utils";
import type { RoadmapUnit } from "@/features/roadmap/types";

export interface RoadmapUnitsProps {
  courseSlug: string;
  units: RoadmapUnit[];
}

/**
 * ============================================================
 * LA RUTA — el recorrido del curso
 * ============================================================
 *
 * A la izquierda corre una columna continua de bloques: uno por cada
 * lección del curso, agrupados por unidad. Los bloques sólidos son lo
 * que ya construiste; los huecos, lo que falta. La columna nunca se
 * corta, así que el temario se lee como una sola pieza que crece de
 * arriba abajo — y de un vistazo se ve qué tan alto has llegado.
 *
 * A la derecha, cada unidad es una pieza tomable. La unidad en curso
 * se distingue por color, por marca ("Estás aquí") y por elevación,
 * nunca sólo por color.
 */
export function RoadmapUnits({ courseSlug, units }: RoadmapUnitsProps) {
  void courseSlug;

  if (units.length === 0) {
    return (
      <p className="rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-card px-6 py-10 text-center text-[15px] text-muted-foreground">
        Aún no hay unidades publicadas en el curso.
      </p>
    );
  }

  const headIndex = findHeadIndex(units);

  return (
    <ol className="flex flex-col">
      {units.map((unit, idx) => {
        const completed =
          unit.lessonCount > 0 && unit.completedCount === unit.lessonCount;
        const isHere = idx === headIndex && unit.published;
        const locked = !unit.published;
        const isLast = idx === units.length - 1;
        const percent =
          unit.lessonCount === 0
            ? 0
            : Math.round((unit.completedCount / unit.lessonCount) * 100);
        const remaining = unit.lessonCount - unit.completedCount;

        const status = completed
          ? { text: "Completada", className: "bg-success-soft text-success" }
          : isHere
            ? { text: "Estás aquí", className: "bg-primary text-primary-foreground" }
            : locked
              ? { text: "Próximamente", className: "bg-surface-2 text-muted-foreground" }
              : unit.completedCount > 0
                ? { text: "En curso", className: "bg-primary-soft text-primary-soft-foreground" }
                : null;

        const card = (
          <div
            className={cn(
              "flex min-h-[104px] items-center gap-4 rounded-[var(--radius-lg)] border p-4 transition-[border-color,box-shadow,transform] duration-200 sm:p-5",
              locked
                ? "border-dashed border-border-strong bg-transparent"
                : isHere
                  ? "border-primary/30 bg-primary-tint shadow-[var(--shadow-md)]"
                  : "border-border bg-card shadow-[var(--shadow-xs)]",
              !locked &&
                "group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-[var(--shadow-md)]",
            )}
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-subtle-foreground">
                  Unidad {unit.order}
                </span>
                {status ? (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-bold",
                      status.className,
                    )}
                  >
                    {status.text}
                  </span>
                ) : null}
              </div>

              <h3
                className={cn(
                  "mt-1.5 text-pretty text-[17px] font-bold leading-snug tracking-[-0.015em] sm:text-[19px]",
                  locked ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {unit.title}
              </h3>

              <p className="mt-1.5 text-[14px] font-medium text-muted-foreground">
                {locked
                  ? "Todavía en preparación"
                  : unit.lessonCount === 0
                    ? "Sin lecciones aún"
                    : completed
                      ? `${unit.lessonCount} ${unit.lessonCount === 1 ? "lección" : "lecciones"} · terminada`
                      : `${unit.completedCount} de ${unit.lessonCount} lecciones · ${percent}%${
                          remaining > 0 && unit.completedCount > 0
                            ? ` · faltan ${remaining}`
                            : ""
                        }`}
              </p>
            </div>

            {!locked ? (
              <ArrowRight
                className={cn(
                  "size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5",
                  isHere ? "text-primary" : "text-subtle-foreground",
                )}
                aria-hidden
              />
            ) : null}
          </div>
        );

        return (
          <li
            key={unit.slug}
            className="grid grid-cols-[36px_minmax(0,1fr)] gap-x-3 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-x-4"
          >
            {/* La columna de bloques: una pieza por lección. */}
            <div className="flex flex-col items-center">
              <UnitNode
                order={unit.order}
                completed={completed}
                isHere={isHere}
                locked={locked}
              />
              <BrickColumn
                className={cn("my-2 flex-1", isLast && "mb-0")}
                total={Math.max(1, unit.lessonCount)}
                done={unit.completedCount}
                current={isHere && !completed ? unit.completedCount : -1}
                locked={locked}
                tone={completed ? "success" : "primary"}
              />
            </div>

            <div className={cn(isLast ? "pb-0" : "pb-4")}>
              {unit.published ? (
                <Link
                  href={`/app/u/${unit.slug}`}
                  aria-label={`Unidad ${unit.order}: ${unit.title}`}
                  className="group block rounded-[var(--radius-lg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {card}
                </Link>
              ) : (
                <div className="group">{card}</div>
              )}
            </div>
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
 * El nudo de la ruta: dónde empieza cada unidad. Palomita = terminada,
 * anillo = aquí estás, número = pendiente, candado = por publicar.
 */
function UnitNode({
  order,
  completed,
  isHere,
  locked,
}: {
  order: number;
  completed: boolean;
  isHere: boolean;
  locked: boolean;
}) {
  if (locked) {
    return (
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] border border-dashed border-border-strong text-subtle-foreground"
      >
        <Lock className="size-4" />
      </span>
    );
  }
  if (completed) {
    return (
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] bg-success text-success-foreground shadow-[var(--shadow-sm)]"
      >
        <Check className="size-[18px]" strokeWidth={3.2} />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] text-[15px] font-extrabold tabular-nums",
        isHere
          ? "animate-here bg-primary text-primary-foreground shadow-[var(--shadow-sm)]"
          : "border border-border bg-card text-muted-foreground",
      )}
    >
      {order}
    </span>
  );
}
