import Link from "next/link";
import { ArrowRight, BookOpen, Flame, Sparkles, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { db } from "@/lib/db";
import {
  getDefaultCourse,
  getSidebarUnits,
  getUserStats,
} from "@/lib/courses";
import { getSession } from "@/lib/get-session";
import { formatNumber } from "@/lib/utils";

export const metadata = {
  title: "Mi panel",
};

export default async function AppHomePage() {
  const session = await getSession();
  if (!session?.user) return null;

  // Paralelizar: course/stats/nextLesson son independientes entre sí.
  const [course, stats, nextLesson] = await Promise.all([
    getDefaultCourse(),
    getUserStats(session.user.id),
    findNextLesson(session.user.id),
  ]);
  const units = course
    ? await getSidebarUnits(course.id, session.user.id)
    : [];

  const totalLessons = units.reduce((sum, u) => sum + u.lessonCount, 0);
  const totalCompleted = units.reduce((sum, u) => sum + u.completedCount, 0);
  const overallPercent =
    totalLessons === 0
      ? 0
      : Math.round((totalCompleted / totalLessons) * 100);

  const firstName = session.user.name.split(" ")[0] ?? session.user.name;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 lg:p-8">
      {/* Saludo */}
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">¡Hola, {firstName}! 👋</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Vamos a programar un rato.
        </h1>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Zap className="size-5" />}
          label="XP totales"
          value={formatNumber(stats.totalXp)}
          accent="primary"
        />
        <StatCard
          icon={<Flame className="size-5" />}
          label="Racha actual"
          value={`${stats.currentStreak} días`}
          accent="warning"
        />
        <StatCard
          icon={<BookOpen className="size-5" />}
          label="Lecciones completadas"
          value={`${totalCompleted} de ${totalLessons}`}
          accent="success"
        />
      </section>

      {/* Continuar */}
      {nextLesson ? (
        <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card">
          <CardHeader>
            <Badge variant="default" className="w-fit">
              <Sparkles className="size-3" />
              Continúa donde te quedaste
            </Badge>
            <CardTitle className="mt-2 text-2xl">{nextLesson.lessonTitle}</CardTitle>
            <CardDescription>
              Unidad {nextLesson.unitOrder} · {nextLesson.unitTitle} ·{" "}
              {nextLesson.estimatedMinutes} min
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg">
              <Link
                href={`/app/u/${nextLesson.unitSlug}/${nextLesson.lessonSlug}`}
              >
                {nextLesson.status === "in_progress"
                  ? "Continuar lección"
                  : "Empezar lección"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Aún no hay lecciones cargadas</CardTitle>
            <CardDescription>
              El contenido se está agregando. Vuelve pronto.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Tu camino */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Tu camino</h2>
          <span className="text-sm text-muted-foreground">
            {overallPercent}% completado
          </span>
        </div>
        <Progress value={overallPercent} />

        <div className="grid gap-3 sm:grid-cols-2">
          {units.map((u) => {
            const percent =
              u.lessonCount === 0
                ? 0
                : Math.round((u.completedCount / u.lessonCount) * 100);
            return (
              <Link
                key={u.slug}
                href={u.published ? `/app/u/${u.slug}` : "#"}
                aria-disabled={!u.published}
                className={`group rounded-xl border bg-card p-4 transition-all ${
                  u.published
                    ? "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                    : "cursor-not-allowed opacity-60"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs text-muted-foreground">
                      U{u.order.toString().padStart(2, "0")}
                    </p>
                    <h3 className="truncate text-base font-semibold">{u.title}</h3>
                  </div>
                  {u.published ? (
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      {u.completedCount}/{u.lessonCount}
                    </span>
                  ) : (
                    <Badge variant="secondary">Próximo</Badge>
                  )}
                </div>
                {u.published ? (
                  <Progress value={percent} className="mt-3 h-1.5" />
                ) : null}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "primary" | "warning" | "success";
}) {
  const accentClasses = {
    primary: "bg-primary/15 text-primary",
    warning: "bg-warning/25 text-warning-foreground",
    success: "bg-success/15 text-success",
  };
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`grid size-12 place-items-center rounded-xl ${accentClasses[accent]}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="truncate text-xl font-semibold tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

async function findNextLesson(userId: string) {
  // Paralelizamos: pedimos en-progreso Y lecciones completadas a la vez.
  // Si hay en-progreso, devolvemos esa (descartamos completedIds).
  // Si no, usamos completedIds para excluir en la query del "siguiente".
  const [inProgress, completedProgress] = await Promise.all([
    db.userLessonProgress.findFirst({
      where: { userId, status: "in_progress" },
      orderBy: { startedAt: "desc" },
      include: { lesson: { include: { unit: true } } },
    }),
    db.userLessonProgress.findMany({
      where: { userId, status: "completed" },
      select: { lessonId: true },
    }),
  ]);

  if (inProgress) {
    return {
      lessonSlug: inProgress.lesson.slug,
      lessonTitle: inProgress.lesson.title,
      unitSlug: inProgress.lesson.unit.slug,
      unitTitle: inProgress.lesson.unit.title,
      unitOrder: inProgress.lesson.unit.order,
      estimatedMinutes: inProgress.lesson.estimatedMinutes,
      status: "in_progress" as const,
    };
  }

  const completedIds = completedProgress.map((p) => p.lessonId);
  const next = await db.lesson.findFirst({
    where: {
      published: true,
      unit: { published: true },
      id: { notIn: completedIds.length ? completedIds : undefined },
    },
    orderBy: [{ unit: { order: "asc" } }, { order: "asc" }],
    include: { unit: true },
  });

  if (!next) return null;

  return {
    lessonSlug: next.slug,
    lessonTitle: next.title,
    unitSlug: next.unit.slug,
    unitTitle: next.unit.title,
    unitOrder: next.unit.order,
    estimatedMinutes: next.estimatedMinutes,
    status: "not_started" as const,
  };
}
