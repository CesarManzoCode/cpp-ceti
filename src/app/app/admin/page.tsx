import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  MetricTile,
  RatioBar,
  formatMinutes,
  formatPct,
} from "@/features/admin/components/metric-tile";
import {
  getFriction,
  getHintUsage,
  getLessonFunnel,
  getLessonStepDropoff,
  getOverview,
  getPracticeFunnel,
  getRetention,
  getRunReport,
  rangeFromDays,
} from "@/features/analytics/queries";
import { requireAdminPage } from "@/lib/admin";

export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90] as const;

interface PageProps {
  searchParams: Promise<{ dias?: string; leccion?: string }>;
}

/**
 * Métricas de producto. Cada número tiene su definición exacta en
 * `docs/product-analytics.md`; las notas de abajo de cada tabla son el
 * resumen, no la definición.
 */
export default async function AdminMetricsPage({ searchParams }: PageProps) {
  // La página vuelve a autorizar: el layout no basta como control de acceso.
  await requireAdminPage();

  const { dias, leccion } = await searchParams;
  const days = RANGES.includes(Number(dias) as (typeof RANGES)[number])
    ? Number(dias)
    : 30;
  const range = rangeFromDays(days);

  const [overview, retention, lessons, practice, friction, hints, runs] =
    await Promise.all([
      getOverview(range),
      getRetention(range.to),
      getLessonFunnel(range),
      getPracticeFunnel(range),
      getFriction(range),
      getHintUsage(range),
      getRunReport(range),
    ]);

  const selectedLessonId = leccion ?? lessons[0]?.resourceId ?? null;
  const dropoff = selectedLessonId
    ? await getLessonStepDropoff(selectedLessonId, range)
    : [];
  const selectedLesson = lessons.find((l) => l.resourceId === selectedLessonId);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        {RANGES.map((option) => (
          <Link
            key={option}
            href={`/app/admin?dias=${option}`}
            className={
              option === days
                ? "rounded-full bg-primary px-3 py-1.5 text-[13px] font-bold text-primary-foreground"
                : "rounded-full border border-border px-3 py-1.5 text-[13px] font-semibold text-muted-foreground hover:text-foreground"
            }
          >
            {option} días
          </Link>
        ))}
        <span className="text-[12px] text-subtle-foreground">
          Ventana: {range.from.toISOString().slice(0, 10)} →{" "}
          {range.to.toISOString().slice(0, 10)} (UTC)
        </span>
      </div>

      {/* ---------------- Uso ---------------- */}
      <section className="space-y-3">
        <h2 className="text-[18px] font-extrabold">Uso</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile
            label="Activos"
            value={overview.activeUsers}
            hint="Hicieron algo real (no sólo entrar ni sólo abrir)."
          />
          <MetricTile
            label="Nuevos registros"
            value={overview.newUsers}
            hint={`${overview.registeredWithoutActivity} sin ninguna actividad`}
          />
          <MetricTile
            label="Primera actividad"
            value={overview.newlyActiveUsers}
            hint="Usuarios que empezaron a usar el producto en esta ventana."
          />
          <MetricTile
            label="Bandeja abierta"
            value={overview.openBugReports + overview.openFeedback}
            hint={`${overview.openBugReports} bugs · ${overview.openFeedback} feedback`}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile
            label="Sesiones de estudio"
            value={overview.sessions.sessions}
            hint={`${overview.sessions.users} usuarios · ${overview.sessions.openSessions} abiertas`}
          />
          <MetricTile
            label="Tiempo activo total"
            value={formatMinutes(overview.sessions.engagedMsTotal)}
            hint="Suma de tiempo activo aproximado, no tiempo de pared."
          />
          <MetricTile
            label="Mediana por sesión"
            value={formatMinutes(overview.sessions.medianEngagedMs)}
            hint={`p90: ${formatMinutes(overview.sessions.p90EngagedMs)}`}
          />
          <MetricTile
            label="Sesiones sin interacción"
            value={overview.sessions.zeroEngagementSessions}
            hint="Abrieron y nunca hubo actividad medible."
          />
        </div>

        <ActivitySpark data={overview.activeByDay} />
      </section>

      {/* ---------------- Retención ---------------- */}
      <section className="space-y-3">
        <h2 className="text-[18px] font-extrabold">
          Retención por cohorte semanal
        </h2>
        <p className="text-[13px] text-muted-foreground">
          Cohorte = semana de la PRIMERA actividad significativa (no del
          registro). La última cohorte siempre está incompleta.
        </p>
        <Table
          head={["Cohorte", "Usuarios", "Semana 0", "Semana 1", "Semana 2", "Semana 3"]}
        >
          {retention.slice(-8).map((cohort) => (
            <tr key={cohort.cohort} className="border-t border-border">
              <Td>{cohort.cohort}</Td>
              <Td>{cohort.size}</Td>
              {cohort.returned.map((count, week) => (
                <Td key={week}>
                  {count}{" "}
                  <span className="text-subtle-foreground">
                    ({formatPct(cohort.size ? count / cohort.size : 0)})
                  </span>
                </Td>
              ))}
            </tr>
          ))}
        </Table>
      </section>

      {/* ---------------- Funnels ---------------- */}
      <section className="space-y-3">
        <h2 className="text-[18px] font-extrabold">Funnel de lecciones</h2>
        <p className="text-[13px] text-muted-foreground">
          Usuarios distintos: abrió → interactuó → completó. Abrir dos veces no
          cuenta doble.
        </p>
        <Table head={["Lección", "Abrieron", "Interactuaron", "Completaron", "Rebote", ""]}>
          {lessons.slice(0, 15).map((row) => (
            <tr key={row.resourceId} className="border-t border-border">
              <Td>
                {row.href ? (
                  <Link href={row.href} className="font-semibold hover:underline">
                    {row.title}
                  </Link>
                ) : (
                  row.title
                )}
              </Td>
              <Td>{row.viewers}</Td>
              <Td>
                {row.engaged}{" "}
                <span className="text-subtle-foreground">
                  ({formatPct(row.engagementRate)})
                </span>
              </Td>
              <Td>
                <span className="inline-flex items-center gap-2">
                  <RatioBar value={row.completionRate} tone="success" />
                  {row.completed} ({formatPct(row.completionRate)})
                </span>
              </Td>
              <Td>{row.bouncedViewers}</Td>
              <Td>
                <Link
                  href={`/app/admin?dias=${days}&leccion=${row.resourceId}`}
                  className="text-[13px] font-semibold text-primary hover:underline"
                >
                  Ver abandono
                </Link>
              </Td>
            </tr>
          ))}
        </Table>
      </section>

      {selectedLesson ? (
        <section className="space-y-3">
          <h2 className="text-[18px] font-extrabold">
            Abandono dentro de «{selectedLesson.title}»
          </h2>
          <p className="text-[13px] text-muted-foreground">
            «Se quedó aquí» = usuarios cuyo último paso visto en la ventana fue
            ese.
          </p>
          <Table head={["#", "Tipo", "Lo vieron", "Se quedaron aquí", "Tasa"]}>
            {dropoff.map((row) => (
              <tr key={row.lessonStepId} className="border-t border-border">
                <Td>{row.stepIndex + 1}</Td>
                <Td>{row.stepType}</Td>
                <Td>{row.viewers}</Td>
                <Td>{row.droppedHere}</Td>
                <Td>
                  <span className="inline-flex items-center gap-2">
                    <RatioBar value={row.dropRate} tone="destructive" />
                    {formatPct(row.dropRate)}
                  </span>
                </Td>
              </tr>
            ))}
          </Table>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-[18px] font-extrabold">Funnel de práctica</h2>
        <Table head={["Ejercicio", "Abrieron", "Interactuaron", "Aprobaron"]}>
          {practice.slice(0, 15).map((row) => (
            <tr key={row.resourceId} className="border-t border-border">
              <Td>
                {row.href ? (
                  <Link href={row.href} className="font-semibold hover:underline">
                    {row.title}
                  </Link>
                ) : (
                  row.title
                )}
              </Td>
              <Td>{row.viewers}</Td>
              <Td>
                {row.engaged}{" "}
                <span className="text-subtle-foreground">
                  ({formatPct(row.engagementRate)})
                </span>
              </Td>
              <Td>
                {row.completed}{" "}
                <span className="text-subtle-foreground">
                  ({formatPct(row.completionRate)})
                </span>
              </Td>
            </tr>
          ))}
        </Table>
      </section>

      {/* ---------------- Fricción ---------------- */}
      <section className="space-y-3">
        <h2 className="text-[18px] font-extrabold">
          Ejercicios con más fricción
        </h2>
        <p className="text-[13px] text-muted-foreground">
          First-pass rate = usuarios cuyo PRIMER envío pasó. Mínimo 3 usuarios
          para aparecer. Se calcula sobre todo el historial del ejercicio hasta
          el fin de la ventana.
        </p>
        <FrictionTable title="Retos de lección" rows={friction.lessonExercises} />
        <FrictionTable title="Práctica" rows={friction.practiceExercises} />
      </section>

      {/* ---------------- Pistas ---------------- */}
      <section className="space-y-3">
        <h2 className="text-[18px] font-extrabold">Uso de pistas</h2>
        <p className="text-[13px] text-muted-foreground">
          Denominador: usuarios con al menos un envío. «Pistas sin enviar» son
          quienes vieron pistas y nunca calificaron — quedan fuera de las tasas
          porque no hay resultado que comparar.
        </p>
        <Table
          head={[
            "Ejercicio",
            "Usuarios",
            "Usaron pistas",
            "Pistas prom.",
            "1er intento OK con pistas",
            "sin pistas",
            "Pistas sin enviar",
          ]}
        >
          {[...hints.lesson, ...hints.practice].slice(0, 15).map((row) => (
            <tr key={row.exerciseId} className="border-t border-border">
              <Td>{row.label}</Td>
              <Td>{row.users}</Td>
              <Td>
                {row.usersWithHints} ({formatPct(row.hintUsageRate)})
              </Td>
              <Td>{row.avgHintsWhenUsed.toFixed(1)}</Td>
              <Td>{formatPct(row.firstPassRateWithHints)}</Td>
              <Td>{formatPct(row.firstPassRateWithoutHints)}</Td>
              <Td>{row.hintViewersWithoutSubmission}</Td>
            </tr>
          ))}
        </Table>
      </section>

      {/* ---------------- Compilar sin calificar ---------------- */}
      <section className="space-y-3">
        <h2 className="text-[18px] font-extrabold">Compilar → Calificar</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" size="md">
            {runs.totalRuns} ejecuciones sin calificar
          </Badge>
          {runs.compileErrors.slice(0, 6).map((error) => (
            <Badge key={error.category} variant="warning" size="md">
              {error.category}: {error.count}
            </Badge>
          ))}
        </div>
        <Table
          head={[
            "Ejercicio",
            "Runs",
            "Envíos",
            "Runs/envío",
            "Compilaron antes del 1er envío",
            "Compilaron y nunca enviaron",
          ]}
        >
          {[...runs.lesson, ...runs.practice].slice(0, 15).map((row) => (
            <tr key={row.exerciseId} className="border-t border-border">
              <Td>{row.label}</Td>
              <Td>{row.runs}</Td>
              <Td>{row.submissions}</Td>
              <Td>{row.runsPerSubmission.toFixed(1)}</Td>
              <Td>{row.avgRunsBeforeFirstSubmit.toFixed(1)}</Td>
              <Td>{row.usersWhoNeverSubmitted}</Td>
            </tr>
          ))}
        </Table>
      </section>

      <p className="border-t border-border pt-4 text-[12px] text-subtle-foreground">
        Definiciones exactas, limitaciones y qué NO capturamos:{" "}
        <code>docs/product-analytics.md</code>.
      </p>
    </div>
  );
}

function FrictionTable({
  title,
  rows,
}: {
  title: string;
  rows: {
    exerciseId: string;
    label: string;
    users: number;
    firstPassRate: number;
    medianAttemptsToPass: number;
    unsolvedUsers: number;
    totalAttempts: number;
  }[];
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-[15px] font-bold text-muted-foreground">{title}</h3>
      <Table
        head={[
          "Ejercicio",
          "Usuarios",
          "First-pass",
          "Envíos hasta aprobar (mediana)",
          "No lo lograron",
        ]}
      >
        {rows.map((row) => (
          <tr key={row.exerciseId} className="border-t border-border">
            <Td>{row.label}</Td>
            <Td>{row.users}</Td>
            <Td>
              <span className="inline-flex items-center gap-2">
                <RatioBar
                  value={row.firstPassRate}
                  tone={row.firstPassRate < 0.35 ? "destructive" : "warning"}
                />
                {formatPct(row.firstPassRate)}
              </span>
            </Td>
            <Td>{row.medianAttemptsToPass}</Td>
            <Td>{row.unsolvedUsers}</Td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

/** Barras de activos por día, en CSS. Sin dependencia de charting. */
function ActivitySpark({ data }: { data: { day: string; users: number }[] }) {
  if (data.length === 0) {
    return (
      <p className="text-[13px] text-muted-foreground">
        Sin actividad registrada en la ventana.
      </p>
    );
  }
  const max = Math.max(...data.map((d) => d.users), 1);
  return (
    <div className="flex items-end gap-1 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-card p-4">
      {data.map((point) => (
        <div key={point.day} className="flex w-6 shrink-0 flex-col items-center gap-1">
          <span className="text-[10px] tabular-nums text-subtle-foreground">
            {point.users}
          </span>
          <span
            className="w-full rounded-t bg-primary"
            style={{ height: `${Math.max(4, (point.users / max) * 72)}px` }}
            title={`${point.day}: ${point.users}`}
          />
          <span className="text-[9px] tabular-nums text-subtle-foreground">
            {point.day.slice(5)}
          </span>
        </div>
      ))}
    </div>
  );
}

function Table({
  head,
  children,
}: {
  head: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-card">
      <table className="w-full min-w-[640px] text-left text-[13px]">
        <thead>
          <tr className="text-[12px] uppercase tracking-[0.04em] text-subtle-foreground">
            {head.map((label, i) => (
              <th key={i} className="px-3 py-2.5 font-bold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2.5 align-middle tabular-nums">{children}</td>;
}
