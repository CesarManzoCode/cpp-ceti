import type { ReportStatus } from "@prisma/client";

import { db } from "@/lib/db";

/**
 * Cola de triage. Trae reportes de contenido y feedback general con el
 * contexto necesario para decidir, y NADA más: mostramos el `username` de
 * quien reportó (para poder responderle), nunca su correo.
 *
 * Las relaciones van en el mismo `include` (un JOIN), no en un bucle.
 */

export interface TriageItem {
  id: string;
  kind: "bug" | "feedback";
  status: ReportStatus;
  message: string;
  /** Qué contenido o pantalla señala el reporte. */
  target: string;
  /** Enlace para ir a verlo, cuando se puede construir. */
  href: string | null;
  authorUsername: string;
  createdAt: Date;
  triagedAt: Date | null;
  resolvedAt: Date | null;
  resolutionNote: string | null;
  issueUrl: string | null;
  prUrl: string | null;
  /** Sólo para feedback: qué tipo de comentario es. */
  feedbackKind: string | null;
}

const OPEN_STATUSES: ReportStatus[] = ["open", "triaged"];

export async function getTriageQueue(options: {
  includeClosed?: boolean;
  limit?: number;
}): Promise<TriageItem[]> {
  const limit = options.limit ?? 50;
  const statusFilter = options.includeClosed
    ? undefined
    : { status: { in: OPEN_STATUSES } };

  const [bugs, feedback] = await Promise.all([
    db.bugReport.findMany({
      where: statusFilter,
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        status: true,
        message: true,
        createdAt: true,
        triagedAt: true,
        resolvedAt: true,
        resolutionNote: true,
        issueUrl: true,
        prUrl: true,
        user: { select: { username: true } },
        lessonStep: {
          select: {
            order: true,
            lesson: {
              select: {
                title: true,
                slug: true,
                unit: {
                  select: { slug: true, course: { select: { slug: true } } },
                },
              },
            },
          },
        },
        exercise: {
          select: {
            step: {
              select: {
                order: true,
                lesson: {
                  select: {
                    title: true,
                    slug: true,
                    unit: {
                      select: { slug: true, course: { select: { slug: true } } },
                    },
                  },
                },
              },
            },
          },
        },
        practiceExercise: {
          select: { title: true, slug: true, course: { select: { slug: true } } },
        },
      },
    }),
    db.feedback.findMany({
      where: statusFilter,
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        status: true,
        kind: true,
        message: true,
        path: true,
        createdAt: true,
        triagedAt: true,
        resolvedAt: true,
        resolutionNote: true,
        issueUrl: true,
        prUrl: true,
        user: { select: { username: true } },
        lesson: {
          select: {
            title: true,
            slug: true,
            unit: {
              select: { slug: true, course: { select: { slug: true } } },
            },
          },
        },
        practiceExercise: {
          select: { title: true, slug: true, course: { select: { slug: true } } },
        },
      },
    }),
  ]);

  const bugItems: TriageItem[] = bugs.map((bug) => {
    const step = bug.lessonStep ?? bug.exercise?.step ?? null;
    const target = step
      ? `${step.lesson.title} · paso ${step.order}`
      : bug.practiceExercise
        ? `Práctica: ${bug.practiceExercise.title}`
        : "Contenido eliminado";
    // Todo enlace del panel lleva el curso: sin él, el triage de un bug de
    // C# abriría la ruta legacy, que redirige a C++.
    const href = step
      ? `/app/c/${step.lesson.unit.course.slug}/u/${step.lesson.unit.slug}/${step.lesson.slug}?p=${step.order}`
      : bug.practiceExercise
        ? `/app/c/${bug.practiceExercise.course.slug}/ejercicios/${bug.practiceExercise.slug}`
        : null;
    return {
      id: bug.id,
      kind: "bug",
      status: bug.status,
      message: bug.message,
      target,
      href,
      authorUsername: bug.user.username,
      createdAt: bug.createdAt,
      triagedAt: bug.triagedAt,
      resolvedAt: bug.resolvedAt,
      resolutionNote: bug.resolutionNote,
      issueUrl: bug.issueUrl,
      prUrl: bug.prUrl,
      feedbackKind: null,
    };
  });

  const feedbackItems: TriageItem[] = feedback.map((item) => {
    const target = item.lesson
      ? `Lección: ${item.lesson.title}`
      : item.practiceExercise
        ? `Práctica: ${item.practiceExercise.title}`
        : (item.path ?? "Sin contexto");
    const href = item.lesson
      ? `/app/c/${item.lesson.unit.course.slug}/u/${item.lesson.unit.slug}/${item.lesson.slug}`
      : item.practiceExercise
        ? `/app/c/${item.practiceExercise.course.slug}/ejercicios/${item.practiceExercise.slug}`
        : item.path;
    return {
      id: item.id,
      kind: "feedback",
      status: item.status,
      message: item.message,
      target,
      href,
      authorUsername: item.user.username,
      createdAt: item.createdAt,
      triagedAt: item.triagedAt,
      resolvedAt: item.resolvedAt,
      resolutionNote: item.resolutionNote,
      issueUrl: item.issueUrl,
      prUrl: item.prUrl,
      feedbackKind: item.kind,
    };
  });

  return [...bugItems, ...feedbackItems].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}

export interface ReportCounts {
  open: number;
  triaged: number;
  resolved: number;
  duplicate: number;
  wontfix: number;
}

/** Conteos por estado (una consulta agregada por tabla, sin N+1). */
export async function getReportCounts(): Promise<{
  bugs: ReportCounts;
  feedback: ReportCounts;
}> {
  const [bugGroups, feedbackGroups] = await Promise.all([
    db.bugReport.groupBy({ by: ["status"], _count: { _all: true } }),
    db.feedback.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  return {
    bugs: toCounts(bugGroups),
    feedback: toCounts(feedbackGroups),
  };
}

function toCounts(
  groups: { status: ReportStatus; _count: { _all: number } }[],
): ReportCounts {
  const counts: ReportCounts = {
    open: 0,
    triaged: 0,
    resolved: 0,
    duplicate: 0,
    wontfix: 0,
  };
  for (const group of groups) counts[group.status] = group._count._all;
  return counts;
}
